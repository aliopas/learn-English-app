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

async function fix() {
    const client = new pg.Client(config);

    try {
        await client.connect();

        // Fetch Day 1
        const res = await client.query('SELECT id, quiz_list FROM lessons WHERE day_number = 1');

        if (res.rows.length === 0) {
            console.log('Day 1 lesson not found');
            return;
        }

        const lesson = res.rows[0];
        const quizList = lesson.quiz_list;
        let modified = false;

        if (!Array.isArray(quizList)) {
            console.log('Quiz list is not an array');
            return;
        }

        quizList.forEach((q, index) => {
            // Identify by unique option set
            if (Array.isArray(q.options) && q.options.includes("I like apples.") && q.options.includes("Me like apples.")) {
                console.log(`Found target question at index ${index}`);
                console.log(`Current state: `, q);

                if (q.correctAnswer !== "I like apples." && q.correct_answer !== "I like apples.") {
                    console.log(' -> Fixing correct answer...');
                    q.correctAnswer = "I like apples.";
                    // cleanup old field if exists inconsistently
                    if (q.correct_answer) delete q.correct_answer;
                    modified = true;
                } else {
                    console.log(' -> Question appears correctly set already.');
                }
            }
        });

        if (modified) {
            await client.query('UPDATE lessons SET quiz_list = $1 WHERE id = $2', [JSON.stringify(quizList), lesson.id]);
            console.log('✅ Successfully updated Day 1 quiz_list in database.');
        } else {
            console.log('No changes needed.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

fix();
