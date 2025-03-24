import db from '../config/Database.js';

const alterCandidatesTable = async () => {
    try {
        await db.query(`
            ALTER TABLE candidates 
            ADD COLUMN IF NOT EXISTS source VARCHAR(255) DEFAULT 'Direct',
            ADD COLUMN IF NOT EXISTS referred_by VARCHAR(255) NULL;
        `);
        console.log('✅ Added source columns to candidates table');
    } catch (error) {
        console.error('❌ Error adding source columns:', error);
        throw error;
    }
};

export default alterCandidatesTable; 