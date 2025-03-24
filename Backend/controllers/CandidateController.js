import { Job, Candidate, CandidateStatusHistory } from '../models/index.js';
import { Op } from 'sequelize';

export const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            include: [{
                model: Job,
                as: 'job',
                attributes: ['id', 'title', 'type', 'city', 'state']
            }],
            attributes: [
                'id', 'uuid', 'name', 'email', 'phone', 
                'experience', 'current_company', 'current_ctc', 
                'expected_ctc', 'notice_period', 'current_location', 
                'preferred_location', 'resume_url', 'status', 
                'notes', 'source', 'referred_by',
                'createdAt', 'updatedAt'
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ msg: error.message });
    }
};

export const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({
            where: { uuid: req.params.id },
            include: [{
                model: Job,
                as: 'job',
                attributes: ['id', 'title', 'type', 'city', 'state']
            }]
        });
        if (!candidate) {
            return res.status(404).json({ msg: "Candidate not found" });
        }
        res.json(candidate);
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ msg: error.message });
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
        const candidateData = {
            ...req.body,
            status: 'applied',
            source: req.body.source || 'Direct'
        };

        const candidate = await Candidate.create(candidateData);
        res.status(201).json(candidate);
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ msg: error.message });
    }
};

export const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, email, phone, experience, current_company, current_ctc,
            expected_ctc, notice_period, current_location, preferred_location,
            status, notes, job_id, source, referred_by
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
            referred_by
        });

        const updatedCandidate = await Candidate.findOne({
            where: { uuid: id },
            include: [{
                model: Job,
                as: 'job',
                attributes: ['id', 'title', 'type', 'city', 'state']
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

        // Then fetch candidates
        const candidates = await Candidate.findAll({
            where: {
                job_id: jobId
            },
            attributes: [
                'id', 'uuid', 'name', 'email', 'phone', 
                'experience', 'current_company', 'current_ctc',
                'expected_ctc', 'notice_period', 'current_location',
                'preferred_location', 'status', 'source', 'referred_by',
                'createdAt', 'updatedAt'
            ],
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'city', 'state']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json( candidates
        );

    } catch (error) {
        console.error('Error fetching candidates by job:', error);
        return res.status(500).json({
            success: false,
            msg: 'Failed to fetch candidates',
            error: error.message
        });
    }
};
