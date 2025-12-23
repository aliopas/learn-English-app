import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Try project/.env ( ../.env )
dotenv.config({ path: path.join(__dirname, '../.env') });

// 2. Try backend/.env ( ../../backend/.env )
if (!process.env.DATABASE_URL) {
    dotenv.config({ path: path.join(__dirname, '../../backend/.env') });
}

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!connectionString) {
    console.error('❌ Error: DATABASE_URL not found in .env files.');
    console.error('   Checked:', path.join(__dirname, '../.env'));
    console.error('   Checked:', path.join(__dirname, '../../backend/.env'));
    process.exit(1);
}

console.log('🔌 Connecting to Database...');

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for most cloud DBs like Neon/Aiven
});

async function dumpSchema() {
    const client = await pool.connect();
    try {
        console.log('🔍 Fetching Schema Information...');

        // 1. Get all tables
        const tablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        let output = `-- ===================================================\n`;
        output += `-- 🗄️ ACTUAL DATABASE SCHEMA DUMP\n`;
        output += `-- Generated at: ${new Date().toISOString()}\n`;
        output += `-- ===================================================\n\n`;

        for (const row of tablesRes.rows) {
            const tableName = row.table_name;
            output += `-- Table: ${tableName}\n`;
            output += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

            // 2. Get Columns
            const columnsRes = await client.query(`
                SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = $1
                ORDER BY ordinal_position;
            `, [tableName]);

            const colDefs = [];
            for (const col of columnsRes.rows) {
                let def = `  ${col.column_name} ${col.data_type}`;

                if (col.character_maximum_length) {
                    def += `(${col.character_maximum_length})`;
                }

                if (col.is_nullable === 'NO') {
                    def += ' NOT NULL';
                }

                if (col.column_default) {
                    def += ` DEFAULT ${col.column_default}`;
                }

                colDefs.push(def);
            }

            output += colDefs.join(',\n');
            output += `\n);\n\n`;
        }

        const outputPath = path.join(__dirname, 'LIVE_DB_DUMP.sql');
        fs.writeFileSync(outputPath, output);

        console.log(`✅ Schema dumped successfully to:\n   ${outputPath}`);

    } catch (err) {
        console.error('❌ Error dumping schema:', err);
    } finally {
        client.release();
        pool.end();
    }
}

dumpSchema();
