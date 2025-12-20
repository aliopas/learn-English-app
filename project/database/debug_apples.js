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

async function checkQuiz() {
    const client = new pg.Client(config);

    try {
        await client.connect();
        console.log('Searching in lessons.quiz_list...');

        const res = await client.query('SELECT day_number, quiz_list FROM lessons');

        let found = false;
        for (const row of res.rows) {
            const quizList = row.quiz_list;
            if (Array.isArray(quizList)) {
                for (let i = 0; i < quizList.length; i++) {
                    const q = quizList[i];
                    // Search for "apples" which was in the screenshot
                    // Serialize to string to search deep content
                    if (JSON.stringify(q).toLowerCase().includes('apples')) {
                        console.log('==================================================');
                        console.log(`FOUND in Day ${row.day_number}, Question Index ${i}`);
                        console.log(`Question: "${q.question}"`);
                        console.log('Options:', q.options);
                        console.log('Correct Answer Field (raw):', q.correctAnswer);
                        console.log('correct_answer Field (raw):', q.correct_answer);

                        // Check type and content
                        const ca = q.correctAnswer !== undefined ? q.correctAnswer : q.correct_answer;
                        console.log(`Effective Correct Answer: '${ca}' (Type: ${typeof ca})`);

                        if (q.options && Array.isArray(q.options)) {
                            console.log('Options Analysis:');
                            q.options.forEach((opt, idx) => {
                                console.log(`  [${idx}] '${opt}'`);
                                if (String(opt).trim().toLowerCase() === String(ca).trim().toLowerCase()) {
                                    console.log(`     ^^^ MATCHES Correct Answer via trim().toLowerCase()`);
                                } else {
                                    // Check for hidden chars
                                    const bufOpt = Buffer.from(String(opt));
                                    const bufCa = Buffer.from(String(ca));
                                    x
                                    if (String(opt).includes(String(ca)) || String(ca).includes(String(opt))) {
                                        console.log(`     ^^^ PARTIAL MATCH or WHITESPACE ISSUE?`);
                                        console.log(`     Opt Buffer: ${bufOpt.toString('hex')}`);
                                        console.log(`     CA Buffer:  ${bufCa.toString('hex')}`);
                                    }
                                }
                            });
                        }
                        found = true;
                    }
                }
            }
        }

        if (!found) {
            console.log('Question with "apples" not found in any lesson quiz_list.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkQuiz();
