
import { query } from './config/database.js';

const addCategoryColumn = async () => {
    console.log('🔧 Adding category column to vocabulary table...');
    try {
        await query(`
            ALTER TABLE vocabulary 
            ADD COLUMN IF NOT EXISTS category TEXT;
        `);
        console.log('✅ Column "category" added successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error altering table:', error);
        process.exit(1);
    }
};

addCategoryColumn();
