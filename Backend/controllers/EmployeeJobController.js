import { Job, User, Candidate } from '../models/index.js';
import { Op } from 'sequelize';

export const getEmployeeJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: {
                created_by_id: req.session.userId
            },
            attributes: [
                'id', 'uuid', 'title', 'type', 'description',
                'city', 'state', 'status', 'openings',
                'created_by', 'created_by_id', 'createdAt', 'updatedAt'
            ],
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'user_id', 'name', 'email']
                },
                {
                    model: Candidate,
                    as: 'candidates',
                    attributes: ['id', 'application_status']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        // Transform the response to include any computed fields
        const transformedJobs = jobs.map(job => {
            const plainJob = job.get({ plain: true });
            return {
                ...plainJob,
                candidateCount: plainJob.candidates?.length || 0,
                creator: plainJob.creator || null
            };
        });
        
        res.status(200).json(transformedJobs);
    } catch (error) {
        console.error('Error fetching employee jobs:', error);
        res.status(500).json({ 
            msg: error.message,
            userId: req.session.userId // Add this for debugging
        });
    }
};

export const getEmployeeJobById = async (req, res) => {
    try {
        const userId = req.userId;
        const isAdmin = req.role === 'admin';
        const { id } = req.params;

        const where = { uuid: id };
        if (!isAdmin) {
            where.created_by_id = userId;
        }

        const job = await Job.findOne({
            where,
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['user_id', 'username', 'email']
                },
                {
                    model: Candidate,
                    as: 'candidates',
                    attributes: ['id', 'status'],
                    required: false
                }
            ]
        });

        if (!job) {
            return res.status(404).json({ msg: "Job not found or access denied" });
        }

        const plainJob = job.get({ plain: true });

        // Calculate candidate statistics
        const candidateStats = {
            total: plainJob.candidates?.length || 0,
            applied: 0,
            screening: 0,
            shortlisted: 0,
            interviewed: 0,
            selected: 0,
            rejected: 0
        };

        plainJob.candidates?.forEach(candidate => {
            if (candidateStats.hasOwnProperty(candidate.status)) {
                candidateStats[candidate.status]++;
            }
        });

        delete plainJob.candidates;

        res.json({
            ...plainJob,
            candidateStats,
            canEdit: isAdmin || plainJob.created_by_id === userId
        });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ 
            msg: "Error fetching job details",
            error: error.message 
        });
    }
};

export const createEmployeeJob = async (req, res) => {
    try {
        const userId = req.userId;
        const username = req.username;

        const jobData = {
            ...req.body,
            created_by: username,
            created_by_id: userId,
            status: 'active'
        };

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

export const updateEmployeeJob = async (req, res) => {
    try {
        const userId = req.userId;
        const isAdmin = req.role === 'admin';
        const { id } = req.params;

        // Find the job
        const job = await Job.findOne({
            where: { 
                uuid: id,
                ...((!isAdmin) && { created_by_id: userId })
            }
        });

        if (!job) {
            return res.status(404).json({ msg: "Job not found or access denied" });
        }

        // Update job
        const updatedJob = await job.update(req.body);

        res.json({
            msg: "Job updated successfully",
            job: updatedJob
        });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ 
            msg: "Error updating job",
            error: error.message 
        });
    }
};

export const getJobStatistics = async (req, res) => {
    try {
        const userId = req.userId;
        const isAdmin = req.role === 'admin';

        const where = !isAdmin ? { created_by_id: userId } : {};

        const statistics = {
            totalJobs: 0,
            activeJobs: 0,
            closedJobs: 0,
            totalCandidates: 0,
            candidatesByStatus: {
                applied: 0,
                screening: 0,
                shortlisted: 0,
                interviewed: 0,
                selected: 0,
                rejected: 0
            }
        };

        // Get job statistics
        const jobs = await Job.findAll({
            where,
            include: [{
                model: Candidate,
                as: 'candidates',
                attributes: ['status']
            }]
        });

        statistics.totalJobs = jobs.length;
        statistics.activeJobs = jobs.filter(job => job.status === 'active').length;
        statistics.closedJobs = jobs.filter(job => job.status === 'closed').length;

        // Calculate candidate statistics
        jobs.forEach(job => {
            job.candidates.forEach(candidate => {
                statistics.totalCandidates++;
                if (statistics.candidatesByStatus.hasOwnProperty(candidate.status)) {
                    statistics.candidatesByStatus[candidate.status]++;
                }
            });
        });

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching job statistics:', error);
        res.status(500).json({ 
            msg: "Error fetching job statistics",
            error: error.message 
        });
    }
}; 