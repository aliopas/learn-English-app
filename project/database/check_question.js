import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root (one level up from database dir)
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

async function check() {
    const client = new pg.Client(config);

    try {
        console.log('Connecting to DB...');
        await client.connect();

        const res = await client.query('SELECT day_number, exercises FROM lessons');

        let found = false;
        for (const row of res.rows) {
            const exercises = row.exercises;
            if (Array.isArray(exercises)) {
                for (let i = 0; i < exercises.length; i++) {
                    const ex = exercises[i];
                    // Search for "apples" which was in the screenshot
                    if (JSON.stringify(ex).includes('I like apples')) {
                        console.log('--------------------------------------------------');
                        console.log(`Found in Day ${row.day_number}, Exercise Index ${i}`);
                        console.log('Question:', ex.question);
                        console.log('Options Raw:', ex.options);
                        console.log('Options Type:', typeof ex.options);
                        console.log('Correct Answer Raw:', ex.correctAnswer !== undefined ? ex.correctAnswer : ex.correct_answer);
                        console.log('Correct Answer Type:', typeof (ex.correctAnswer !== undefined ? ex.correctAnswer : ex.correct_answer));
                        found = true;
                    }
                }
            }
        }

        if (!found) {
            console.log('Question not found in database.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

check();
