import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.VITE_DB_HOST,
    port: parseInt(process.env.VITE_DB_PORT || '5432'),
    database: process.env.VITE_DB_NAME,
    user: process.env.VITE_DB_USER,
    password: process.env.VITE_DB_PASSWORD,
    ssl: process.env.VITE_DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false
};

async function migrate() {
    const client = new pg.Client(config);

    try {
        console.log('🔄 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!');

        console.log('⚙️ Adding saved_answers column...');

        // Add saved_answers column if it doesn't exist
        await client.query(`
      ALTER TABLE lesson_progress 
      ADD COLUMN IF NOT EXISTS saved_answers JSONB DEFAULT '{}';
    `);

        console.log('✅ Migration successful: saved_answers column added.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await client.end();
    }
}

migrate();
