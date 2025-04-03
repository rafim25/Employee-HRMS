import { Sequelize } from "sequelize";// Backend/controllers/jobController.js

import { Job, Candidate } from '../models/index.js';

export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create job', error });
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
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await job.update(req.body);
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update job', error });
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

export default {
  getJobs
  // ... other controller methods
};