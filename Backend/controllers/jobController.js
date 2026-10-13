import { Sequelize } from "sequelize";// Backend/controllers/jobController.js

import { Job, Candidate } from '../models/index.js';
import { Op } from 'sequelize';
import db from '../config/Database.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import { parsePagination, paginationMeta, wantsPagination } from '../utils/pagination.js';

export const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    
    // Ensure editable_by is an array
    if (jobData.editable_by && !Array.isArray(jobData.editable_by)) {
      jobData.editable_by = [jobData.editable_by];
    }
    
    const job = await Job.create(jobData);
    
    res.status(201).json({
      msg: "Job created successfully",
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      msg: "Error creating job",
      error: error.message
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const usePaging = wantsPagination(req.query);
    const { page, limit, offset } = parsePagination(req.query);

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.type) where.type = req.query.type;
    if (req.query.search) {
      const q = String(req.query.search).trim();
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { city: { [Op.like]: `%${q}%` } },
        { state: { [Op.like]: `%${q}%` } },
      ];
    }

    const query = {
      where,
      include: [{
        model: Candidate,
        as: 'candidates',
        attributes: ['id'],
      }],
      order: [['createdAt', 'DESC']],
      distinct: true,
    };

    if (usePaging) {
      query.limit = limit;
      query.offset = offset;
    }

    const result = usePaging
      ? await Job.findAndCountAll(query)
      : { rows: await Job.findAll(query), count: null };

    const rows = result.rows || result;
    const jobsWithCount = rows.map((job) => {
      const plainJob = job.get({ plain: true });
      return {
        ...plainJob,
        candidateCount: plainJob.candidates?.length || 0,
        candidates: undefined,
      };
    });

    if (usePaging) {
      return res.status(200).json({
        data: jobsWithCount,
        pagination: paginationMeta(page, limit, result.count),
      });
    }

    res.status(200).json(jobsWithCount);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ 
      msg: error.message || 'Failed to fetch jobs'
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch job', error });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = req.body;
    
    // Ensure editable_by is an array
    if (jobData.editable_by && !Array.isArray(jobData.editable_by)) {
      jobData.editable_by = [jobData.editable_by];
    }
    
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({
        msg: "Job not found"
      });
    }
    
    await job.update(jobData);
    
    res.json({
      msg: "Job updated successfully",
      job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      msg: "Error updating job",
      error: error.message
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.destroy();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete job', error });
  }
};

export const updateJobStatus = async (req, res) => {
    const { id } = req.params;
    const { status, changed_by } = req.body;

    try {
        // Validate status
        const validStatuses = ['active', 'draft', 'closed', 'archived', 'expired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                msg: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        // Find the job
        const job = await Job.findByPk(id);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        // Start a transaction
        const transaction = await db.transaction();

        try {
            // Update job status
            await job.update({
                status,
                updatedAt: new Date(),
                updated_by: changed_by
            }, { transaction });

            // If job is being archived or closed, update associated candidates
            if (status === 'archived' || status === 'closed') {
                await Candidate.update(
                    {
                        status: 'archived',
                        updatedAt: new Date()
                    },
                    {
                        where: {
                            job_id: id,
                            status: {
                                [Op.notIn]: ['selected', 'rejected'] // Don't update selected or rejected candidates
                            }
                        },
                        transaction
                    }
                );
            }

            // Commit transaction
            await transaction.commit();

            res.json({
                msg: `Job status updated to ${status}`,
                job: await job.reload()
            });

        } catch (error) {
            // Rollback transaction on error
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error('Error updating job status:', error);
        res.status(500).json({
            msg: "Error updating job status",
            error: error.message
        });
    }
};

const JOB_STATUSES = ['active', 'draft', 'closed', 'archived', 'expired'];
const JOB_TYPES = ['full-time', 'fulltime', 'part-time', 'parttime', 'contract', 'internship'];

const pickField = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return typeof value === 'string' ? value.trim() : value;
    }
  }
  return undefined;
};

const splitList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split(/[,|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const resolveCreator = async (row, sessionUser) => {
  const creatorId = pickField(row, ['created_by_id', 'Creator_ID', 'creator_id', 'Created_By_ID']) || sessionUser?.user_id;
  if (!creatorId) {
    throw new Error('Creator ID is required. Use the logged-in user ID or provide created_by_id in Excel.');
  }
  const creator = await User.findOne({ where: { user_id: String(creatorId) } });
  if (!creator) {
    throw new Error(`Creator ID "${creatorId}" does not exist in the users table.`);
  }
  return creator;
};

export const bulkUploadJobs = async (req, res) => {
  try {
    const { jobs } = req.body;
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid jobs data provided',
      });
    }

    const sessionUser = req.user || { user_id: req.userId, username: req.name };
    const results = { success: [], duplicates: [], errors: [] };

    for (const [index, rawJob] of jobs.entries()) {
      const rowNumber = index + 2;
      const title = pickField(rawJob, ['title', 'Title', 'job_title', 'Job Title']);
      try {
        if (!title) {
          throw new Error('Title is required.');
        }

        const type = pickField(rawJob, ['type', 'Type', 'job_type', 'Job Type']);
        if (!type) {
          throw new Error('Type is required (Full-Time, Part-Time, Contract, or Internship).');
        }
        const normalizedType = String(type).trim();
        if (!JOB_TYPES.includes(normalizedType.toLowerCase().replace(/\s+/g, '-'))) {
          throw new Error(`Invalid type "${normalizedType}". Allowed: Full-Time, Part-Time, Contract, Internship.`);
        }

        const statusValue = pickField(rawJob, ['status', 'Status']) || 'draft';
        const status = String(statusValue).toLowerCase();
        if (!JOB_STATUSES.includes(status)) {
          throw new Error(`Invalid status "${statusValue}". Allowed: ${JOB_STATUSES.join(', ')}.`);
        }

        const clientEmail = pickField(rawJob, ['clientEmail', 'client_email', 'Client Email']);
        if (clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(clientEmail))) {
          throw new Error(`Client email "${clientEmail}" is not a valid email address.`);
        }

        const minSalary = parseNumber(pickField(rawJob, ['minSalary', 'min_salary', 'Min Salary']));
        const maxSalary = parseNumber(pickField(rawJob, ['maxSalary', 'max_salary', 'Max Salary']));
        if (minSalary !== null && Number.isNaN(minSalary)) {
          throw new Error('minSalary must be a number.');
        }
        if (maxSalary !== null && Number.isNaN(maxSalary)) {
          throw new Error('maxSalary must be a number.');
        }
        if (minSalary !== null && maxSalary !== null && maxSalary < minSalary) {
          throw new Error('maxSalary cannot be less than minSalary.');
        }

        let openings = parseNumber(pickField(rawJob, ['openings', 'Openings'])) ?? 1;
        if (Number.isNaN(openings) || openings < 1) {
          throw new Error('openings must be a whole number of 1 or more.');
        }
        openings = Math.floor(openings);

        const creator = await resolveCreator(rawJob, sessionUser);

        const editableRaw = pickField(rawJob, ['editable_by', 'editableBy', 'Editable_By']);
        const editableBy = splitList(editableRaw);
        for (const editorId of editableBy) {
          const editor = await User.findOne({ where: { user_id: editorId } });
          if (!editor) {
            throw new Error(`editable_by user ID "${editorId}" does not exist in the users table.`);
          }
        }

        const experienceMin = parseNumber(pickField(rawJob, ['experience_min', 'Experience Min', 'exp_min']));
        const experienceMax = parseNumber(pickField(rawJob, ['experience_max', 'Experience Max', 'exp_max']));
        let experienceRange = [0, 10];
        if (experienceMin !== null || experienceMax !== null) {
          const minExp = experienceMin ?? 0;
          const maxExp = experienceMax ?? minExp;
          if (Number.isNaN(minExp) || Number.isNaN(maxExp)) {
            throw new Error('experience_min and experience_max must be numbers.');
          }
          if (maxExp < minExp) {
            throw new Error('experience_max cannot be less than experience_min.');
          }
          experienceRange = [minExp, maxExp];
        }

        const deadlineRaw = pickField(rawJob, ['deadline', 'Deadline']);
        let deadline = null;
        if (deadlineRaw) {
          deadline = new Date(deadlineRaw);
          if (Number.isNaN(deadline.getTime())) {
            throw new Error(`deadline "${deadlineRaw}" is not a valid date. Use YYYY-MM-DD.`);
          }
        }

        const duplicate = await Job.findOne({
          where: {
            title,
            created_by_id: creator.user_id,
          },
        });
        if (duplicate) {
          results.duplicates.push({
            name: title,
            email: normalizedType,
            error: `Row ${rowNumber}: A job with title "${title}" already exists for creator ${creator.user_id}.`,
          });
          continue;
        }

        const created = await Job.create({
          uuid: uuidv4(),
          title,
          type: normalizedType,
          description: pickField(rawJob, ['description', 'Description']) || null,
          state: pickField(rawJob, ['state', 'State']) || null,
          city: pickField(rawJob, ['city', 'City']) || null,
          minSalary: minSalary,
          maxSalary: maxSalary,
          status,
          openings,
          deadline,
          clientName: pickField(rawJob, ['clientName', 'client_name', 'Client Name']) || null,
          clientEmail: clientEmail || null,
          clientLocation: pickField(rawJob, ['clientLocation', 'client_location', 'Client Location']) || null,
          skills: splitList(pickField(rawJob, ['skills', 'Skills'])),
          interviewRounds: splitList(pickField(rawJob, ['interviewRounds', 'interview_rounds', 'Interview Rounds'])),
          questions: splitList(pickField(rawJob, ['questions', 'Questions'])),
          experienceRange,
          created_by_id: creator.user_id,
          created_by: creator.username,
          editable_by: editableBy,
        });

        results.success.push({
          name: title,
          email: creator.user_id,
          id: created.uuid,
          message: `Row ${rowNumber}: Job created with creator ID ${creator.user_id}.`,
        });
      } catch (error) {
        results.errors.push({
          name: title || `Row ${rowNumber}`,
          email: pickField(rawJob, ['type', 'Type']) || '',
          error: `Row ${rowNumber}: ${error.message}`,
        });
      }
    }

    const message = `Processed ${jobs.length} jobs: ${results.success.length} successful, ${results.duplicates.length} duplicates, ${results.errors.length} errors`;
    return res.status(200).json({
      success: true,
      message,
      results,
    });
  } catch (error) {
    console.error('Bulk job upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process jobs',
      error: error.message,
    });
  }
};

export default {
  getJobs
  // ... other controller methods
};