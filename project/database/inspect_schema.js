import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

async function inspectSchema() {
    const client = new pg.Client(config);

    try {
        await client.connect();
        console.log('Connected. Fetching tables...');

        const tablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        console.log('Tables found:', tablesRes.rows.map(r => r.table_name).join(', '));

        for (const table of tablesRes.rows) {
            const tableName = table.table_name;
            if (tableName === 'lessons' || tableName === 'exercises') {
                console.log(`\nColumns in table '${tableName}':`);
                const colsRes = await client.query(`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = $1
                `, [tableName]);

                colsRes.rows.forEach(col => {
                    console.log(` - ${col.column_name} (${col.data_type})`);
                });
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

inspectSchema();
