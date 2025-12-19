
import { query } from './config/database.js';

const updateSchema = async () => {
    console.log('🔧 Updating Database Schema...');
    try {
        console.log(' - Adding "category" column to vocabulary...');
        await query(`ALTER TABLE vocabulary ADD COLUMN IF NOT EXISTS category VARCHAR(50);`);

        console.log(' - Adding "difficulty" column to exercises...');
        await query(`ALTER TABLE exercises ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'easy';`);

        console.log(' - Adding "image_url" column to lessons...');
        await query(`ALTER TABLE lessons ADD COLUMN IF NOT EXISTS image_url TEXT;`);

        console.log('✅ Schema updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating schema:', error);
        process.exit(1);
    }
};

updateSchema();
