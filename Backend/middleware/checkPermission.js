import { Job, Candidate } from '../models/index.js';

export const checkPermission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId =  req.userId || req.user.user_id ;
        const model = req.baseUrl.includes('jobs') ? Job : Candidate;

        const item = await model.findOne({ where: { uuid: id } });
        
        if (!item) {
            return res.status(404).json({ msg: "Item not found" });
        }

        // Check if user is creator or admin
        if (item.created_by_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ 
                msg: "You don't have permission to modify this item" 
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ msg: "Error checking permissions", error: error.message });
    }
}; 