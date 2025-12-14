
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

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

async function clearContent() {
    const client = new pg.Client(config);

    try {
        console.log('🔄 Connecting to Database...');
        await client.connect();

        console.log('🧹 Clearing content tables (TRUNCATE)...');
        // RESTART IDENTITY resets the serial counters to 1
        await client.query('TRUNCATE lessons, vocabulary, exercises RESTART IDENTITY CASCADE');

        console.log('✅ Tables cleared successfully! They are now empty and ready.');

    } catch (err) {
        console.error('❌ Error clearing tables:', err);
    } finally {
        await client.end();
    }
}

clearContent();
