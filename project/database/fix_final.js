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

async function fixFinal() {
    const client = new pg.Client(config);

    try {
        await client.connect();

        const res = await client.query('SELECT id, quiz_list FROM lessons WHERE day_number = 1');

        if (res.rows.length === 0) return;

        const lesson = res.rows[0];
        const quizList = lesson.quiz_list;
        let modified = false;

        quizList.forEach((q, index) => {
            // Fix "Apples" Question
            if (JSON.stringify(q).includes("I like apples.")) {
                console.log(`Checking Apples Question at index ${index}...`);

                // The controller prefers 'correct_answer' or 'answer'
                // It OVERWRITES 'correctAnswer'

                // We want correct_answer to be "I like apples."
                if (q.correct_answer !== "I like apples.") {
                    console.log(' -> Setting correct_answer to "I like apples."');
                    q.correct_answer = "I like apples.";
                    modified = true;
                }

                // We MUST remove 'answer' if it's "I like apples" (no dot) because it might interfere if correct_answer was null (though we just set it)
                // But let's clean it up to avoid confusion
                if (q.answer) {
                    console.log(' -> Removing legacy "answer" field');
                    delete q.answer;
                    modified = true;
                }

                // Verify options
                if (Array.isArray(q.options) && !q.options.includes("I like apples.")) {
                    console.log(' -> WARNING: Option "I like apples." not exact match in options!');
                }
            }

            // Fix "You" Question (just cleanup)
            if (q.question && q.question.includes("You")) {
                console.log(`Checking 'You' Question at index ${index}...`);
                // The correct answer visually was "المفرد والجمع المخاطب"
                const targetAns = "المفرد والجمع المخاطب";

                if (q.correct_answer !== targetAns) {
                    console.log(` -> Updating 'You' correct_answer to '${targetAns}'`);
                    q.correct_answer = targetAns;
                    modified = true;
                }

                if (q.answer) {
                    console.log(' -> Removing legacy "answer" field from "You" question');
                    delete q.answer;
                    modified = true;
                }
            }

        });

        if (modified) {
            await client.query('UPDATE lessons SET quiz_list = $1 WHERE id = $2', [JSON.stringify(quizList), lesson.id]);
            console.log('✅ DATABASE UPDATED SUCCESSFULLY.');
        } else {
            console.log('No changes needed.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

fixFinal();
