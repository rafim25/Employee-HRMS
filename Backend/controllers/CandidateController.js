import { Job, Candidate, CandidateStatusHistory, User } from '../models/index.js';
import { Op } from 'sequelize';
import multer from 'multer';
import { uploadToS3, getSignedUrl } from '../utils/s3Config.js';
import { processResumesForCandidates } from '../utils/resumeHelper.js';
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

    // Results array to track success and failures
    const results = {
      success: [],
      duplicates: [],
      errors: []
    };

    // Process candidates sequentially to check for duplicates
    for (const candidate of candidates) {
      try {
        // Check for existing candidate
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
              attributes: ['title']
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
            error: errorMessage
          });
          continue;
        }

        // Prepare candidate data
        const candidateData = {
          ...candidate,
          status: 'applied',
          source: candidate.source || 'Direct',
          created_by,
          created_by_id,
          email: candidate.email.toLowerCase().trim(),
          phone: candidate.phone.toString().trim().replace(/\s+/g, '')
        };

        // Create the candidate
        const newCandidate = await Candidate.create(candidateData);
        results.success.push({
          name: candidate.name,
          email: candidate.email,
          id: newCandidate.uuid
        });

      } catch (error) {
        results.errors.push({
          name: candidate.name,
          email: candidate.email,
          error: error.message
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
    try {
        if (candidate.resume_url) {
            // If the resume_url is a full URL, return as is
            if (candidate.resume_url.startsWith('http')) {
                return {
                    ...candidate,
                    resume_url: candidate.resume_url
                };
            }

            // If it's just a key, generate a signed URL from S3
            const s3 = new AWS.S3();
            const signedUrl = await s3.getSignedUrlPromise('getObject', {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: candidate.resume_url,
                Expires: 3600 // URL expires in 1 hour
            });

            return {
                ...candidate,
                resume_url: signedUrl
            };
        }
        return candidate;
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
                'preferred_location', 'resume_url', 'status', 
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

                    if (plainCandidate.status === 'rejected') {
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
                'preferred_location', 'resume_url', 'status', 
                'notes', 'source', 'referred_by',
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
        if (plainCandidate.status === 'rejected') {
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
        const { uuid  } = req.params;
        const { status , changed_by} = req.body;

        const candidate = await Candidate.findOne({ where: { uuid: uuid } });

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const validStatuses = ['applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        await candidate.update({ status });

        await CandidateStatusHistory.create({
            uuid: crypto.randomUUID(),
            candidate_id: candidate.id,
            status,
            changed_by: changed_by,
            changed_at: new Date(),
            notes: req.body.notes || null
        });

        res.status(200).json({ 
            message: 'Status updated successfully', 
            status 
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
                'preferred_location', 'status', 'source', 'referred_by',
                'resume_url', 'created_by', 'created_by_id',
                'rejection_reason', 'rejection_details', 'current_round',
                'job_answers', 'createdAt', 'updatedAt'
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
                    attributes: ['id', 'username', 'email'],
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
        const { status, rejection_reason, rejection_details, changed_by } = req.body;
        const candidateId = req.params.uuid;

        const candidate = await Candidate.findOne({
            where: { uuid: candidateId }
        });

        if (!candidate) {
            return res.status(404).json({ msg: "Candidate not found" });
        }

        await candidate.update({
            status,
            rejection_reason,
            rejection_details,
            updatedAt: new Date(),
            updated_by: changed_by
        });

        res.status(200).json({
            msg: "Candidate status and rejection details updated successfully",
            candidate
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
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
