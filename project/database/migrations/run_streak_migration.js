import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory (go up from migrations folder)
const envPath = resolve(__dirname, '../../../backend/.env');
console.log('📁 Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('❌ Error loading .env file:', result.error);
    process.exit(1);
}

console.log('✅ Environment variables loaded successfully');

// Force disable SSL certificate validation (same as backend/config/database.js)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const runMigration = async () => {
    console.log('📋 Checking environment variables...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_SSL:', process.env.DB_SSL);

    // Build connection string from individual params if DATABASE_URL is not available
    let connectionString;
    let sslConfig;

    if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
        connectionString = process.env.DATABASE_URL;
        sslConfig = { rejectUnauthorized: false };
        console.log('✅ Using DATABASE_URL');
    } else {
        connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
        console.log('✅ Built connection string from individual params');
    }

    const client = new Client({
        connectionString,
        ssl: sslConfig
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected successfully!');

        console.log('📝 Running streak tracking migration...');

        const migrationSQL = readFileSync(
            join(__dirname, 'add_streak_tracking.sql'),
            'utf-8'
        );

        await client.query(migrationSQL);

        console.log('✅ Migration completed successfully!');
        console.log('🔥 Streak tracking is now enabled!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
        console.log('👋 Database connection closed');
    }
};

runMigration();
