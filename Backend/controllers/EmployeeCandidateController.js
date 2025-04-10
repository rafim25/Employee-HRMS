import { Candidate, Job, User } from "../models/index.js";
import { Op } from 'sequelize';
import { processResumeForCandidate } from '../utils/resumeHelper.js';

export const getEmployeeCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            where: {
                created_by_id: req.userId
            },
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'status']
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        const transformedCandidates = candidates.map(candidate => {
            const plainCandidate = candidate.get({ plain: true });
            return {
                ...plainCandidate,
                job: plainCandidate.job,
                created_by: plainCandidate.creator?.name || 'N/A',
                creator: plainCandidate.creator
            };
        });
        
        res.status(200).json(transformedCandidates);
    } catch (error) {
        console.error('Error fetching employee candidates:', error);
        res.status(500).json({ msg: error.message });
    }
};

export const getEmployeeCandidateById = async (req, res) => {
    try {
        const userId = req.userId;
        const isAdmin = req.role === 'admin';
        const { id } = req.params;

        const where = { uuid: id };
        if (!isAdmin) {
            where.created_by_id = userId;
        }

        const candidate = await Candidate.findOne({
            where,
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'city', 'state', 'questions']
                },
                {
                    model: Users,
                    as: 'creator',
                    attributes: ['user_id', 'username', 'email']
                }
            ]
        });

        if (!candidate) {
            return res.status(404).json({ msg: "Candidate not found or access denied" });
        }

        const plainCandidate = candidate.get({ plain: true });

        // Process the candidate data
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

            const processedCandidate = await processResumeForCandidate(plainCandidate);
            res.json(processedCandidate);
        } catch (error) {
            console.error('Error processing candidate data:', error);
            res.json(plainCandidate);
        }
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ 
            msg: "Error fetching candidate details",
            error: error.message 
        });
    }
};

export const updateEmployeeCandidate = async (req, res) => {
    try {
        const userId = req.userId;
        const isAdmin = req.role === 'admin';
        const { id } = req.params;

        // Find the candidate
        const candidate = await Candidate.findOne({
            where: { 
                uuid: id,
                ...((!isAdmin) && { created_by_id: userId })
            }
        });

        if (!candidate) {
            return res.status(404).json({ msg: "Candidate not found or access denied" });
        }

        // Update candidate
        const updatedCandidate = await candidate.update(req.body);

        res.json({
            msg: "Candidate updated successfully",
            candidate: updatedCandidate
        });
    } catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ 
            msg: "Error updating candidate",
            error: error.message 
        });
    }
};

export const getEmployeeCandidatesByJob = async (req, res) => {
    try {
        const userId = req.userId;
        const isAdmin = req.role === 'admin';
        const { jobId } = req.params;
        const { all = 'false' } = req.query;

        const where = { job_id: jobId };
        if (!isAdmin && all !== 'true') {
            where.created_by_id = userId;
        }

        const candidates = await Candidate.findAll({
            where,
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'type', 'city', 'state']
                },
                {
                    model: Users,
                    as: 'creator',
                    attributes: ['user_id', 'username', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates by job:', error);
        res.status(500).json({ 
            msg: "Error fetching candidates",
            error: error.message 
        });
    }
}; 