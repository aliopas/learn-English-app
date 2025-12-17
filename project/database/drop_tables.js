
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

async function dropTables() {
    const client = new pg.Client(config);

    try {
        console.log('🔄 Connecting to Database...');
        await client.connect();

        console.log('💥 Dropping tables to force schema update...');
        // Drop lessons and dependent tables to force recreation
        await client.query('DROP TABLE IF EXISTS vocabulary CASCADE');
        await client.query('DROP TABLE IF EXISTS exercises CASCADE');
        await client.query('DROP TABLE IF EXISTS lessons CASCADE');
        // We might as well drop others if we want a clean slate, but let's stick to the ones we modified.
        // Actually, seed_content clears them anyway. Dropping ensures schema is recreated.

        console.log('✅ Tables dropped successfully!');

    } catch (err) {
        console.error('❌ Error dropping tables:', err);
    } finally {
        await client.end();
    }
}

dropTables();
