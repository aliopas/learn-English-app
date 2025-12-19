import { query } from './config/database.js';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateQuiz = async () => {
    try {
        console.log('🔄 Reading test.json...');
        // test.json is in the project root, so we go up one level from backend
        const jsonPath = path.join(__dirname, '../test.json');

        if (!fs.existsSync(jsonPath)) {
            console.error('❌ test.json not found at:', jsonPath);
            process.exit(1);
        }

        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(rawData);

        // Extract quiz list from the JSON structure
        const quizList = data?.study_schedule?.Day_01?.quiz;

        if (!quizList || !Array.isArray(quizList)) {
            console.error('❌ Quiz list not found in study_schedule.Day_01.quiz');
            console.log('Structure found:', JSON.stringify(data?.study_schedule?.Day_01, null, 2));
            process.exit(1);
        }

        console.log(`✅ Found ${quizList.length} questions locally.`);

        console.log('🔄 Updating database for Day 1...');

        const result = await query(
            `UPDATE lessons 
             SET quiz_list = $1,
                 updated_at = NOW()
             WHERE day_number = $2
             RETURNING id, title`,
            [JSON.stringify(quizList), 1]
        );

        if (result.rowCount === 0) {
            console.log('⚠️ Lesson for Day 1 not found in database. Please ensure Day 1 lesson exists first.');
        } else {
            console.log('✅ Lesson 1 quiz_list updated successfully.');
            console.log('Lesson Title:', result.rows[0].title);
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Error updating quiz:', error);
        process.exit(1);
    }
};

updateQuiz();
