import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function runMigration() {
    const client = new pg.Client(config);

    try {
        console.log('🔄 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!');

        const sqlPath = path.join(__dirname, 'content-schema.sql');
        console.log(`📄 Reading SQL file: ${sqlPath}`);

        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing migration...');
        await client.query(sql);

        console.log('✅ Content tables created successfully!');

    } catch (error) {
        console.error('❌ Migration failed!', error);
    } finally {
        await client.end();
    }
}

runMigration();
