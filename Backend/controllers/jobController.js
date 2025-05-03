import { Sequelize } from "sequelize";// Backend/controllers/jobController.js

import { Job, Candidate } from '../models/index.js';
import { Op } from 'sequelize';
import db from '../config/Database.js';

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
    const jobs = await Job.findAll({
      include: [{
        model: Candidate,
        as: 'candidates',
        attributes: ['id'] // Only include id for counting
      }],
      order: [['createdAt', 'DESC']]
    });

    // Transform the response to include candidate count
    const jobsWithCount = jobs.map(job => {
      const plainJob = job.get({ plain: true });
      return {
        ...plainJob,
        candidateCount: plainJob.candidates?.length || 0,
        candidates: undefined // Remove the candidates array
      };
    });

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

export default {
  getJobs
  // ... other controller methods
};