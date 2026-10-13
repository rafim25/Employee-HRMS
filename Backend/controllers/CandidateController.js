import { Job, Candidate, CandidateStatusHistory, User } from '../models/index.js';
import { Op } from 'sequelize';
import multer from 'multer';
import { uploadToS3, getSignedUrl } from '../utils/s3Config.js';
import { processResumesForCandidates } from '../utils/resumeHelper.js';
import { parsePagination, paginationMeta } from '../utils/pagination.js';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';

// Configure multer
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage }).single('file');// Use memory storage instead of disk storage

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream' // Some browsers might send this mime type
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel files are allowed.'));
  }
};

// const uploadMiddleware = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   }
// }).single('file');

export const bulkUploadCandidates = async (req, res) => {
  try {
    const { candidates, created_by, created_by_id } = req.body;

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid candidates data provided'
      });
    }

    const pickCandidateField = (row, keys) => {
      for (const key of keys) {
        const value = row[key];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          return typeof value === 'string' ? value.trim() : value;
        }
      }
      return undefined;
    };

    const resolveExistingJob = async (rawCandidate) => {
      const jobIdRaw = pickCandidateField(rawCandidate, ['job_id', 'Job_ID', 'jobId', 'Job ID']);
      if (jobIdRaw === undefined) {
        return null; // job_id is optional for bulk upload
      }
      const asNumber = Number(jobIdRaw);
      let job = null;
      if (Number.isInteger(asNumber) && asNumber > 0) {
        job = await Job.findByPk(asNumber);
      }
      if (!job) {
        job = await Job.findOne({ where: { uuid: String(jobIdRaw) } });
      }
      if (!job) {
        throw new Error(`Job ID "${jobIdRaw}" does not exist. Use an existing jobs.id from Job Management, or leave job_id blank.`);
      }
      return job;
    };

    const results = {
      success: [],
      duplicates: [],
      errors: []
    };

    for (const [index, candidate] of candidates.entries()) {
      const rowNumber = index + 2;
      try {
        if (!candidate.name || !candidate.email || !candidate.phone) {
          throw new Error('name, email, and phone are required.');
        }

        const linkedJob = await resolveExistingJob(candidate);

        const creatorId = candidate.created_by_id || created_by_id || req.userId;
        if (!creatorId) {
          throw new Error('created_by_id is required. Download the template while signed in, or provide a valid user ID.');
        }
        const creator = await User.findOne({ where: { user_id: String(creatorId) } });
        if (!creator) {
          throw new Error(`Creator ID "${creatorId}" does not exist in the users table.`);
        }

        const existingCandidate = await Candidate.findOne({
          where: {
            [Op.or]: [
              { email: candidate.email },
              { phone: candidate.phone },
              {
                [Op.and]: [
                  { name: candidate.name },
                  { phone: candidate.phone }
                ]
              }
            ]
          },
          include: [
            {
              model: Job,
              as: 'job',
              attributes: ['title'],
              required: false,
            }
          ]
        });

        if (existingCandidate) {
          let errorMessage = 'Candidate already exists: ';
          if (existingCandidate.email === candidate.email) {
            errorMessage += `Email ${candidate.email} is already registered`;
          }
          if (existingCandidate.phone === candidate.phone) {
            errorMessage += `${errorMessage ? ' and phone ' : 'Phone '} ${candidate.phone} is already registered`;
          }
          if (existingCandidate.name === candidate.name && existingCandidate.phone === candidate.phone) {
            errorMessage += ` for job: ${existingCandidate.job?.title || 'Unknown'}`;
          }

          results.duplicates.push({
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            error: `Row ${rowNumber}: ${errorMessage}`
          });
          continue;
        }

        const candidateData = {
          ...candidate,
          job_id: linkedJob ? linkedJob.id : null,
          application_status: candidate.application_status || 'applied',
          source: candidate.source || 'Direct',
          created_by: candidate.created_by || creator.username || created_by,
          created_by_id: String(creator.user_id),
          email: candidate.email.toLowerCase().trim(),
          phone: candidate.phone.toString().trim().replace(/\s+/g, '')
        };
        delete candidateData.status;

        const newCandidate = await Candidate.create(candidateData);
        results.success.push({
          name: candidate.name,
          email: candidate.email,
          id: newCandidate.uuid,
          message: linkedJob
            ? `Row ${rowNumber}: Candidate linked to job ${linkedJob.id} (${linkedJob.title}).`
            : `Row ${rowNumber}: Candidate created without a job link.`,
        });

      } catch (error) {
        results.errors.push({
          name: candidate.name,
          email: candidate.email,
          error: `Row ${rowNumber}: ${error.message}`
        });
      }
    }

    // Prepare response message
    const message = `Processed ${candidates.length} candidates: `
      + `${results.success.length} successful, `
      + `${results.duplicates.length} duplicates, `
      + `${results.errors.length} errors`;

    return res.status(200).json({
      success: true,
      message,
      results,
      candidatesProcessed: results.success.length
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process candidates',
      error: error.message
    });
  }
};

const processResumeForCandidate = async (candidate) => {
    const withStatus = {
        ...candidate,
        status: candidate.application_status || candidate.status,
    };

    try {
        if (withStatus.resume_url) {
            // If the resume_url is a full URL, return as is
            if (withStatus.resume_url.startsWith('http')) {
                return {
                    ...withStatus,
                    resume_url: withStatus.resume_url
                };
            }

            // Local uploads are stored as /uploads/... — serve as-is via static route
            if (
              withStatus.resume_url.startsWith('/uploads/') ||
              withStatus.resume_url.startsWith('uploads/')
            ) {
              const key = withStatus.resume_url.replace(/^\//, '');
              return {
                ...withStatus,
                resume_url: `${process.env.APP_PUBLIC_URL || `http://localhost:${process.env.APP_PORT || 3002}`}/${key}`,
              };
            }

            // If it's just a key, generate a signed URL from S3 when configured
            const bucket = process.env.AWS_BUCKET_NAME || process.env.AWS_S3_BUCKET;
            if (!bucket || !process.env.AWS_ACCESS_KEY_ID) {
              return withStatus;
            }

            const s3 = new AWS.S3({
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              region: process.env.AWS_REGION || 'ap-south-1',
            });
            const signedUrl = await s3.getSignedUrlPromise('getObject', {
                Bucket: bucket,
                Key: withStatus.resume_url,
                Expires: 3600 // URL expires in 1 hour
            });

            return {
                ...withStatus,
                resume_url: signedUrl
            };
        }
        return withStatus;
    } catch (error) {
        console.error('Error processing resume URL:', error);
        // Return the candidate with original resume_url if there's an error
        return candidate;
    }
};

export const getCandidates = async (req, res) => {
    try {
        const where = {};
        const { source, createdBy } = req.query;

        if (source) {
            where.source = source;
        }

        if (createdBy) {
            where.created_by_id = createdBy;
        }

        const candidates = await Candidate.findAll({
            where,
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'city', 'state', 'questions']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['user_id', 'username', 'email'],
                }
            ],
            attributes: [
                'id', 'uuid', 'name', 'email', 'phone', 
                'experience', 'current_company', 'current_ctc', 
                'expected_ctc', 'notice_period', 'current_location', 
                'preferred_location', 'resume_url', 'application_status',
                'notes', 'source', 'referred_by',
                'created_by', 'created_by_id',
                'createdAt', 'updatedAt',
                'job_answers',
                'rejection_details',
                'rejection_reason'
            ],
            order: [['createdAt', 'DESC']]
        });

        // Debug log for raw candidates
        console.log('Fetched candidates count:', candidates.length);

        const processedCandidates = await Promise.all(candidates.map(async candidate => {
            const plainCandidate = candidate.get({ plain: true });
            
            // Debug log for resume URL before processing
            console.log(`Processing candidate ${plainCandidate.id} resume:`, plainCandidate.resume_url);

            try {
                // Process job answers
                if (plainCandidate.job_answers) {
                    plainCandidate.job_answers = typeof plainCandidate.job_answers === 'string' 
                        ? JSON.parse(plainCandidate.job_answers)
                        : plainCandidate.job_answers;
                }

                // Process rejection details
                if (plainCandidate.rejection_details) {
                    const rejectionDetails = typeof plainCandidate.rejection_details === 'string'
                        ? JSON.parse(plainCandidate.rejection_details)
                        : plainCandidate.rejection_details;

                    if (plainCandidate.application_status === 'rejected') {
                        plainCandidate.rejection_information = {
                            reason: plainCandidate.rejection_reason,
                            ...rejectionDetails
                        };
                    }
                }

                // Format questionnaire
                if (plainCandidate.job?.questions && plainCandidate.job_answers) {
                    plainCandidate.questionnaire = plainCandidate.job.questions.map(question => ({
                        question: question,
                        answer: plainCandidate.job_answers[question] || 'Not answered'
                    }));
                }

                // Use existing processResumeForCandidate function
                const processedCandidate = await processResumeForCandidate(plainCandidate);
                
                // Debug log for processed resume URL
                console.log(`Processed resume URL for ${processedCandidate.id}:`, processedCandidate.resume_url);
                
                return processedCandidate;
            } catch (error) {
                console.error(`Error processing candidate ${plainCandidate.id}:`, error);
                return plainCandidate;
            }
        }));

        // Final debug log
        console.log('Total processed candidates:', processedCandidates.length);

        res.json(processedCandidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ 
            msg: "Error fetching candidates",
            error: error.message 
        });
    }
};

const candidateIncludeConfig = [
    {
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'type', 'city', 'state', 'questions']
    },
    {
        model: User,
        as: 'creator',
        attributes: ['user_id', 'username', 'email'],
    }
];

const candidateAttributesConfig = [
    'id', 'uuid', 'name', 'email', 'phone',
    'experience', 'current_company', 'current_ctc',
    'expected_ctc', 'notice_period', 'current_location',
    'preferred_location', 'resume_url', 'application_status',
    'notes', 'source', 'referred_by',
    'created_by', 'created_by_id',
    'createdAt', 'updatedAt',
    'job_answers',
    'rejection_details',
    'rejection_reason'
];

const enrichCandidateData = async (candidate) => {
    const plainCandidate = candidate.get({ plain: true });

    try {
        if (plainCandidate.job_answers) {
            plainCandidate.job_answers = typeof plainCandidate.job_answers === 'string'
                ? JSON.parse(plainCandidate.job_answers)
                : plainCandidate.job_answers;
        }

        if (plainCandidate.rejection_details) {
            const rejectionDetails = typeof plainCandidate.rejection_details === 'string'
                ? JSON.parse(plainCandidate.rejection_details)
                : plainCandidate.rejection_details;

            if (plainCandidate.application_status === 'rejected') {
                plainCandidate.rejection_information = {
                    reason: plainCandidate.rejection_reason,
                    ...rejectionDetails
                };
            }
        }

        if (plainCandidate.job?.questions && plainCandidate.job_answers) {
            plainCandidate.questionnaire = plainCandidate.job.questions.map(question => ({
                question: question,
                answer: plainCandidate.job_answers[question] || 'Not answered'
            }));
        }

        return await processResumeForCandidate({
            ...plainCandidate,
            status: plainCandidate.application_status,
        });
    } catch (error) {
        console.error(`Error enriching candidate ${plainCandidate.id}:`, error);
        return plainCandidate;
    }
};

const buildCandidateWhereClause = (query = {}) => {
    const where = {};
    const andConditions = [];

    const {
        source,
        createdBy,
        status,
        search,
        jobTitle,
        jobApplied,
        location,
        minSalary,
        maxSalary,
        minExperience,
        maxExperience,
        fromDate,
        toDate
    } = query;

    if (source) where.source = source;
    if (createdBy) where.created_by_id = createdBy;
    if (status) where.application_status = status;

    if (search) {
        andConditions.push({
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ]
        });
    }

    const jobFilter = jobTitle || jobApplied;
    if (jobFilter) {
        andConditions.push({
            '$job.title$': { [Op.like]: `%${jobFilter}%` }
        });
    }

    if (location) {
        andConditions.push({
            [Op.or]: [
                { current_location: { [Op.like]: `%${location}%` } },
                { preferred_location: { [Op.like]: `%${location}%` } }
            ]
        });
    }

    if (minExperience || maxExperience) {
        where.experience = {};
        if (minExperience) where.experience[Op.gte] = Number(minExperience);
        if (maxExperience) where.experience[Op.lte] = Number(maxExperience);
    }

    if (minSalary || maxSalary) {
        where.expected_ctc = {};
        if (minSalary) where.expected_ctc[Op.gte] = Number(minSalary);
        if (maxSalary) where.expected_ctc[Op.lte] = Number(maxSalary);
    }

    if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
        if (toDate) where.createdAt[Op.lte] = new Date(toDate);
    }

    if (andConditions.length > 0) {
        where[Op.and] = andConditions;
    }

    return where;
};

export const getCandidatesPaginated = async (req, res) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);

        const where = buildCandidateWhereClause(req.query);

        const { rows, count } = await Candidate.findAndCountAll({
            where,
            include: candidateIncludeConfig,
            attributes: candidateAttributesConfig,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        const processedCandidates = await Promise.all(
            rows.map(candidate => enrichCandidateData(candidate))
        );

        return res.json({
            data: processedCandidates,
            pagination: paginationMeta(page, limit, count)
        });
    } catch (error) {
        console.error('Error fetching paginated candidates:', error);
        return res.status(500).json({
            msg: 'Error fetching paginated candidates',
            error: error.message
        });
    }
};

export const searchCandidates = async (req, res) => {
    try {
        const where = buildCandidateWhereClause(req.query);
        const { page, limit, offset } = parsePagination(req.query);

        const { rows, count } = await Candidate.findAndCountAll({
            where,
            include: candidateIncludeConfig,
            attributes: candidateAttributesConfig,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true
        });

        const processedCandidates = await Promise.all(
            rows.map(candidate => enrichCandidateData(candidate))
        );

        return res.json({
            data: processedCandidates,
            count: processedCandidates.length,
            pagination: paginationMeta(page, limit, count)
        });
    } catch (error) {
        console.error('Error searching candidates:', error);
        return res.status(500).json({
            msg: 'Error searching candidates',
            error: error.message
        });
    }
};

export const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({
            where: { uuid: req.params.id },
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'city', 'state', 'questions']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['user_id', 'username', 'email']
                }
            ],
            attributes: [
                // Basic Information
                'id', 'uuid', 'name', 'email', 'phone',
                'experience', 'current_company', 'current_ctc',
                'expected_ctc', 'notice_period', 'current_location',
                'preferred_location', 'resume_url', 'application_status',
                'notes', 'source', 'referred_by', 'job_id',
                'created_by', 'created_by_id',

                // Job Questions & Answers
                'job_answers',

                // Rejection Details
                'rejection_reason',
                'rejection_details',

                // Timestamps
                'createdAt', 'updatedAt'
            ]
        });

        if (!candidate) {
            return res.status(404).json({ msg: "Candidate not found" });
        }

        // Convert to plain object for manipulation
        const plainCandidate = candidate.get({ plain: true });

        // Process job answers if they exist
        if (plainCandidate.job_answers) {
            try {
                plainCandidate.job_answers = typeof plainCandidate.job_answers === 'string'
                    ? JSON.parse(plainCandidate.job_answers)
                    : plainCandidate.job_answers;
            } catch (e) {
                console.warn('Error parsing job_answers:', e);
                plainCandidate.job_answers = {};
            }
        }

        // Process rejection details if candidate is rejected
        if (plainCandidate.application_status === 'rejected') {
            try {
                const rejectionDetails = typeof plainCandidate.rejection_details === 'string'
                    ? JSON.parse(plainCandidate.rejection_details)
                    : plainCandidate.rejection_details;

                plainCandidate.rejection_information = {
                    reason: plainCandidate.rejection_reason,
                    ...rejectionDetails
                };
            } catch (e) {
                console.warn('Error parsing rejection_details:', e);
                plainCandidate.rejection_information = {
                    reason: plainCandidate.rejection_reason,
                    stage: '',
                    rejected_by: '',
                    rejected_at: null,
                    comments: ''
                };
            }
        }

        // Format job questions and answers if they exist
        if (plainCandidate.job?.questions && plainCandidate.job_answers) {
            plainCandidate.questionnaire = plainCandidate.job.questions.map(question => ({
                question: question,
                answer: plainCandidate.job_answers[question] || 'Not answered'
            }));
        }

        // Process resume URL
        const processedCandidate = await processResumeForCandidate(plainCandidate);

        // Clean up response by removing redundant fields
        const cleanedCandidate = {
            ...processedCandidate,
            rejection_details: undefined // Remove raw rejection_details since we have formatted rejection_information
        };

        res.json(cleanedCandidate);
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ 
            msg: "Error fetching candidate details",
            error: error.message 
        });
    }
};

export const getCandidatesByJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const candidates = await Candidate.findAll({
            where: { jobId },
            include: [{
                model: Job,
                attributes: ['title', 'type', 'location']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createCandidate = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            uploadMiddleware(req, res, (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        // First check for existing candidate with same email, phone, or name
        const existingCandidate = await Candidate.findOne({
            where: {
                [Op.or]: [
                    { email: req.body.email },
                    { phone: req.body.phone },
                    {
                        [Op.and]: [
                            { name: req.body.name },
                            { phone: req.body.phone }
                        ]
                    }
                ]
            },
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['title']
                }
            ]
        });

        if (existingCandidate) {
            let errorMessage = 'Candidate already exists: ';
            if (existingCandidate.email === req.body.email) {
                errorMessage += `Email ${req.body.email} is already registered`;
            }
            if (existingCandidate.phone === req.body.phone) {
                errorMessage += `${errorMessage ? ' and phone ' : 'Phone '} ${req.body.phone} is already registered`;
            }
            if (existingCandidate.name === req.body.name && existingCandidate.phone === req.body.phone) {
                errorMessage += ` for job: ${existingCandidate.job?.title || 'Unknown'}`;
            }

            return res.status(400).json({
                msg: errorMessage,
                existingCandidate: {
                    name: existingCandidate.name,
                    email: existingCandidate.email,
                    phone: existingCandidate.phone,
                    job: existingCandidate.job?.title,
                    status: existingCandidate.status
                }
            });
        }

        // Verify user exists
        const user = await User.findOne({
            where: { user_id: req.body.created_by_id }
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid user ID" });
        }

        // // Handle resume upload
        // let resumeUrl = null;
        // if (req.file) {
        //     resumeUrl = await uploadToS3(req.file);
        // }

        // Create new candidate
        const candidateData = {
            ...req.body,
            status: 'applied',
            source: req.body.source || 'Direct',
            resume_url: req.body.resume_url,
            created_by: user.username,
            created_by_id: user.user_id,
            
            // Ensure email and phone are properly formatted
            email: req.body.email.toLowerCase().trim(),
            phone: req.body.phone.trim().replace(/\s+/g, '')
        };

        const candidate = await Candidate.create(candidateData);

        // Fetch the created candidate with all associations
        const createdCandidate = await Candidate.findOne({
            where: { id: candidate.id },
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'city', 'state']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['user_id', 'username', 'email']
                }
            ]
        });

        const responseData = {
            ...createdCandidate.toJSON(),
            resume_url: req.body.resume_url ? await getSignedUrl(req.body.resume_url.split('/').pop()) : null
        };

        res.status(201).json({
            msg: "Candidate created successfully",
            candidate: responseData
        });

    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ 
            msg: error.message,
            error: error instanceof multer.MulterError ? 'File upload error' : 'Server error'
        });
    }
};

/**
 * Upload resume or image for an existing candidate.
 * Expects multipart field named `resume` or `image` (matches frontend FormData).
 * Route: POST /api/candidates/:id/upload/:type  where type is resume|image
 */
export const uploadCandidateAttachment = async (req, res) => {
    try {
        const { id, type } = req.params;
        const allowed = ['resume', 'image'];
        if (!allowed.includes(type)) {
            return res.status(400).json({
                msg: 'Invalid upload type. Use resume or image.',
            });
        }

        if (!req.file) {
            return res.status(400).json({
                msg: `No ${type} file uploaded. Expected field name "${type}".`,
            });
        }

        const candidate = await Candidate.findOne({ where: { uuid: id } });
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        const folder = type === 'resume' ? 'resumes' : 'photos';
        const url = await uploadToS3(req.file, folder);

        if (type === 'resume') {
            await candidate.update({ resume_url: url });
        }

        return res.status(200).json({
            success: true,
            url,
            msg: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`,
            candidate: {
                uuid: candidate.uuid,
                resume_url: type === 'resume' ? url : candidate.resume_url,
            },
        });
    } catch (error) {
        console.error('Error uploading candidate attachment:', error);
        return res.status(500).json({
            msg: `Failed to upload ${req.params?.type || 'file'}`,
            error: error.message,
        });
    }
};

export const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, email, phone, experience, current_company, current_ctc,
            expected_ctc, notice_period, current_location, preferred_location,
            status, notes, job_id, source, referred_by, job_answers,
            rejection_details, rejection_reason, resume_url
        } = req.body;

        const candidate = await Candidate.findOne({ where: { uuid: id } });

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        await candidate.update({
            name,
            email,
            phone,
            experience,
            current_company,
            current_ctc,
            expected_ctc,
            notice_period,
            current_location,
            preferred_location,
            status,
            notes,
            job_id,
            source,
            referred_by,
            job_answers,
            rejection_details,
            rejection_reason,
            resume_url
        });

        const updatedCandidate = await Candidate.findOne({
            where: { uuid: id },
            include: [{
                model: Job,
                as: 'job',
                attributes: ['id', 'title', 'type', 'city', 'state', 'questions']
            }]
        });

        res.status(200).json(updatedCandidate);
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ message: 'Failed to update candidate', error: error.message });
    }
};

export const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({
            where: { uuid: req.params.id }
        });
        if (!candidate) {
            return res.status(404).json({ msg: "Candidate not found" });
        }
        await candidate.destroy();
        res.json({ msg: "Candidate deleted successfully" });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ msg: error.message });
    }
};

export const updateCandidateStatus = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { status, changed_by } = req.body;

        const candidate = await Candidate.findOne({ where: { uuid: uuid } });

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const validStatuses = ['applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected', 'joined'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Update application_status instead of status
        await candidate.update({ application_status: status });

        // Create status history
        await CandidateStatusHistory.create({
            uuid: crypto.randomUUID(),
            candidate_id: candidate.id,
            status: status, // Make sure to pass status explicitly
            changed_by: changed_by || 'system',
            changed_at: new Date(),
            notes: req.body.notes || null
        });

        // Fetch updated candidate to confirm new status
        const updatedCandidate = await Candidate.findOne({ where: { uuid: uuid } });

        res.status(200).json({ 
            message: 'Status updated successfully', 
            status: updatedCandidate.application_status // Return the new application_status
        });
    } catch (error) {
        console.error('Error updating candidate status:', error);
        res.status(500).json({ 
            message: 'Failed to update status', 
            error: error.message 
        });
    }
};

export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { 
            name,
            email,
            phone,
            experience,
            currentCompany,
            currentCTC,
            expectedCTC,
            noticePeriod,
            currentLocation,
            preferredLocation
        } = req.body;

        // Check if job exists
        const job = await Job.findOne({
            where: { uuid: jobId }
        });

        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        // Check if already applied
        const existingApplication = await Candidate.findOne({
            where: {
                email: email,
                jobId: job.id
            }
        });

        if (existingApplication) {
            return res.status(400).json({ msg: "You have already applied for this job" });
        }

        // Create candidate application
        const candidate = await Candidate.create({
            name,
            email,
            phone,
            experience,
            currentCompany,
            currentCTC,
            expectedCTC,
            noticePeriod,
            currentLocation,
            preferredLocation,
            jobId: job.id,
            status: 'applied',
            uploadedBy: req.userId // This comes from your auth middleware
        });

        res.status(201).json({
            msg: "Application submitted successfully",
            candidate
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const getCandidatesByJobId = async (req, res) => {
    try {
        const { jobId } = req.params;

        // First verify the job exists
        const job = await Job.findOne({
            where: { id: jobId }
        });

        if (!job) {
            return res.status(404).json({
                msg: 'Job not found'
            });
        }

        // Then fetch candidates with existing columns only
        const candidates = await Candidate.findAll({
            where: {
                job_id: jobId
            },
            attributes: [
                'id', 'uuid', 'name', 'email', 'phone', 
                'experience', 'current_company', 'current_ctc',
                'expected_ctc', 'notice_period', 'current_location',
                'preferred_location', 'application_status', 'source', 'referred_by',
                'resume_url', 'created_by', 'created_by_id',
                'rejection_reason', 'rejection_details', 'current_round',
                'application_status', 'job_answers', 'createdAt', 'updatedAt'
            ],
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'city', 'state']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['user_id', 'username', 'email'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Transform the data to include creator details
        const transformedCandidates = candidates.map(candidate => {
            const plainCandidate = candidate.get({ plain: true });
            return {
                ...plainCandidate,
                created_by: plainCandidate.creator?.username || plainCandidate.created_by || 'N/A',
                created_by_email: plainCandidate.creator?.email,
                creator: undefined // Remove the nested creator object
            };
        });

        return res.status(200).json(transformedCandidates);

    } catch (error) {
        console.error('Error fetching candidates by job:', error);
        return res.status(500).json({
            success: false,
            msg: 'Failed to fetch candidates',
            error: error.message
        });
    }
};

export const shareCandidates = async (req, res) => {
    try {
        const { jobId, candidates, clientEmail, clientName, jobTitle } = req.body;

        // Create email content
        const emailContent = `
            Dear ${clientName},

            Here are the shortlisted candidates for the position of ${jobTitle}:

            ${candidates.map(candidate => `
                - ${candidate.name}
                - Email: ${candidate.email}
                - Experience: ${candidate.experience} years
                - Resume: ${candidate.resume_url}
            `).join('\n')}

            Best regards,
            Your Recruitment Team
        `;

        // Send email using your email service
        await sendEmail({
            to: clientEmail,
            subject: `Shortlisted Candidates for ${jobTitle}`,
            text: emailContent,
            attachments: candidates
                .filter(c => c.resume_url)
                .map(c => ({
                    filename: `${c.name}_resume.pdf`,
                    path: c.resume_url
                }))
        });

        res.status(200).json({ message: 'Candidates shared successfully' });
    } catch (error) {
        console.error('Error sharing candidates:', error);
        res.status(500).json({ message: 'Failed to share candidates' });
    }
};

export const rejectCandidate = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { rejection_reason, rejection_details, changed_by } = req.body;

        const candidate = await Candidate.findOne({
            where: { uuid: uuid }
        });

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        // Update both status fields and rejection details
        await candidate.update({
            application_status: 'rejected',
            rejection_reason,
            rejection_details,
            updated_by: changed_by
        });

        // Create status history entry
        await CandidateStatusHistory.create({
            uuid: crypto.randomUUID(),
            candidate_id: candidate.id,
            status: 'rejected',
            changed_by: changed_by,
            changed_at: new Date(),
            notes: rejection_reason
        });

        res.status(200).json({
            message: "Candidate rejected successfully",
            application_status: 'rejected',
            rejection_details
        });

    } catch (error) {
        console.error('Error rejecting candidate:', error);
        res.status(500).json({
            message: "Failed to reject candidate",
            error: error.message
        });
    }
};

export const checkDuplicate = async (req, res) => {
  try {
    const { email, phone, name } = req.body;

    // Check for duplicate email
    const existingEmail = await Candidate.findOne({ where: { email } });
    if (existingEmail) {
      return res.json({
        isDuplicate: true,
        message: 'A candidate with this email already exists'
      });
    }

    // Check for duplicate phone
    const existingPhone = await Candidate.findOne({ where: { phone } });
    if (existingPhone) {
      return res.json({
        isDuplicate: true,
        message: 'A candidate with this phone number already exists'
      });
    }

    // Check for duplicate name and phone combination
    const existingNamePhone = await Candidate.findOne({
      where: {
        name,
        phone
      }
    });
    if (existingNamePhone) {
      return res.json({
        isDuplicate: true,
        message: 'A candidate with this name and phone number already exists'
      });
    }

    return res.json({
      isDuplicate: false
    });
  } catch (error) {
    console.error('Check duplicate error:', error);
    res.status(500).json({
      isDuplicate: true,
      message: 'Error checking for duplicate candidates'
    });
  }
};

export const getEmployeeCandidates = async (req, res) => {
    try {
        const userId = req.user.user_id; // Assuming you have user info in req.user from auth middleware

        const candidates = await Candidate.findAll({
            where: {
                created_by_id: userId // Filter by the creator's user ID
            },
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'city', 'state', 'questions']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['user_id', 'username', 'email']
                }
            ],
            attributes: [
                'id', 'uuid', 'name', 'email', 'phone', 
                'experience', 'current_company', 'current_ctc', 
                'expected_ctc', 'notice_period', 'current_location', 
                'preferred_location', 'resume_url', 'application_status', 
                'notes', 'source', 'referred_by',
                'created_by', 'created_by_id',
                'createdAt', 'updatedAt',
                'job_answers',
                'rejection_details',
                'rejection_reason'
            ],
            order: [['createdAt', 'DESC']]
        });

        // Process candidates similar to the getCandidates function
        const processedCandidates = await Promise.all(candidates.map(async candidate => {
            const plainCandidate = candidate.get({ plain: true });
            
            try {
                // Process job answers
                if (plainCandidate.job_answers) {
                    plainCandidate.job_answers = typeof plainCandidate.job_answers === 'string' 
                        ? JSON.parse(plainCandidate.job_answers)
                        : plainCandidate.job_answers;
                }

                // Process rejection details
                if (plainCandidate.rejection_details) {
                    const rejectionDetails = typeof plainCandidate.rejection_details === 'string'
                        ? JSON.parse(plainCandidate.rejection_details)
                        : plainCandidate.rejection_details;

                    if (plainCandidate.application_status === 'rejected') {
                        plainCandidate.rejection_information = {
                            reason: plainCandidate.rejection_reason,
                            ...rejectionDetails
                        };
                    }
                }

                // Format questionnaire
                if (plainCandidate.job?.questions && plainCandidate.job_answers) {
                    plainCandidate.questionnaire = plainCandidate.job.questions.map(question => ({
                        question: question,
                        answer: plainCandidate.job_answers[question] || 'Not answered'
                    }));
                }

                // Process resume URL
                return await processResumeForCandidate(plainCandidate);
            } catch (error) {
                console.error(`Error processing candidate ${plainCandidate.id}:`, error);
                return plainCandidate;
            }
        }));

        res.json(processedCandidates);
    } catch (error) {
        console.error('Error fetching employee candidates:', error);
        res.status(500).json({ 
            msg: "Error fetching candidates",
            error: error.message 
        });
    }
};
