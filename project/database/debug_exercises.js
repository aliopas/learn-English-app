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

async function debugExercises() {
    const client = new pg.Client(config);

    try {
        await client.connect();

        // Search for relevant exercises
        const res = await client.query(`
            SELECT e.id, e.question, e.options, e.correct_answer, l.day_number
            FROM exercises e
            JOIN lessons l ON e.lesson_id = l.id
            WHERE e.options::text ILIKE '%apples%'
        `);

        console.log(`Found ${res.rows.length} exercises matching 'apples'`);

        for (const row of res.rows) {
            console.log('--------------------------------------------------');
            console.log(`Day: ${row.day_number}, Exercise ID: ${row.id}`);
            console.log(`Question: ${row.question}`);
            console.log(`Options (Raw):`, JSON.stringify(row.options, null, 2));
            console.log(`Correct Answer (DB): '${row.correct_answer}'`);

            // Simulation of frontend check
            if (Array.isArray(row.options)) {
                row.options.forEach((opt, idx) => {
                    const isMatch = opt.trim().toLowerCase() === row.correct_answer.trim().toLowerCase();
                    console.log(`Option [${idx}]: '${opt}' Match? ${isMatch}`);
                });
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

debugExercises();
