import { getSignedUrl } from './s3Config.js';

/**
 * Generates a signed URL for a resume
 * @param {string} resumeUrl - The stored S3 URL of the resume
 * @returns {Promise<string>} - The signed URL for temporary access
 */
export const generateSignedResumeUrl = async (resumeUrl) => {
    try {
        if (!resumeUrl) return null;
        
        // Extract the file key from the stored URL
        const fileKey = resumeUrl.split('/').pop();
        // Generate and return temporary signed URL
        return await getSignedUrl(fileKey);
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw new Error('Failed to generate resume access URL');
    }
};

/**
 * Processes an array of candidates to add signed URLs for their resumes
 * @param {Array} candidates - Array of candidate objects
 * @returns {Promise<Array>} - Candidates with signed resume URLs
 */
export const processResumesForCandidates = async (candidates) => {
    try {
        if (!Array.isArray(candidates)) {
            return candidates;
        }

        return await Promise.all(candidates.map(async (candidate) => {
            if (!candidate.resume_url) return candidate;

            const signedUrl = await generateSignedResumeUrl(candidate.resume_url);
            return {
                ...candidate,
                resume_url: signedUrl
            };
        }));
    } catch (error) {
        console.error('Error processing resumes:', error);
        throw new Error('Failed to process resume URLs');
    }
};

/**
 * Processes a single candidate to add signed URL for resume
 * @param {Object} candidate - Candidate object
 * @returns {Promise<Object>} - Candidate with signed resume URL
 */
export const processResumeForCandidate = async (candidate) => {
    try {
        if (!candidate || !candidate.resume_url) return candidate;

        const signedUrl = await generateSignedResumeUrl(candidate.resume_url);
        return {
            ...candidate,
            resume_url: signedUrl
        };
    } catch (error) {
        console.error('Error processing resume:', error);
        throw new Error('Failed to process resume URL');
    }
}; 