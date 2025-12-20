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

async function verify() {
    const client = new pg.Client(config);

    try {
        await client.connect();

        const res = await client.query('SELECT day_number, quiz_list FROM lessons WHERE day_number = 1');

        if (res.rows.length > 0) {
            const quizList = res.rows[0].quiz_list;
            quizList.forEach((q, i) => {
                if (JSON.stringify(q).includes('apples')) {
                    console.log(`Question Index ${i}:`);
                    console.log('Full Object:', JSON.stringify(q, null, 2));
                    console.log('Type of correctAnswer:', typeof q.correctAnswer);
                    console.log('Value of correctAnswer:', q.correctAnswer);
                    console.log('Type of correct_answer:', typeof q.correct_answer);
                    console.log('Value of correct_answer:', q.correct_answer);
                }
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

verify();
