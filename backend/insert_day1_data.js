import { query } from './config/database.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const insertDay1 = async () => {
    try {
        console.log('🔄 Reading test.json...');
        const jsonPath = path.join(__dirname, '../test.json');

        if (!fs.existsSync(jsonPath)) {
            console.error('❌ test.json not found at:', jsonPath);
            process.exit(1);
        }

        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(rawData);

        const day1 = data?.study_schedule?.Day_01;

        if (!day1) {
            console.error('❌ Day_01 data not found in test.json');
            process.exit(1);
        }

        const quizList = day1.quiz || [];
        const topic = day1.topic || 'Lesson 1';

        console.log(`✅ Found Day 1 data.`);
        console.log(`   - Topic: ${topic}`);
        console.log(`   - Quiz questions: ${quizList.length}`);

        console.log('🔄 Inserting into database for Day 1...');

        // We use ON CONFLICT to update if it exists, or INSERT if it doesn't.
        // User said "Day 1 doesn't exist", so INSERT is primary goal.
        // But using ON CONFLICT is safer.
        // We will fill other required fields with defaults since test.json only has quiz and topic.

        const insertQuery = `
            INSERT INTO lessons (
                day_number, 
                title, 
                level, 
                description, 
                grammar_topic, 
                grammar_content, 
                reading_text, 
                video_url, 
                image_url,
                vocabulary_list,
                quiz_list,
                flashcards_list,
                updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
            )
            ON CONFLICT (day_number) DO UPDATE SET
                title = EXCLUDED.title,
                quiz_list = EXCLUDED.quiz_list,
                updated_at = NOW()
            RETURNING id, title;
        `;

        const values = [
            1, // day_number
            topic, // title
            'Beginner', // level (default)
            'Learn about pronouns', // description (placeholder)
            topic, // grammar_topic (reusing topic)
            '', // grammar_content (empty for now)
            '', // reading_text (empty for now)
            '', // video_url
            '', // image_url
            '[]', // vocabulary_list (empty json)
            JSON.stringify(quizList), // quiz_list
            '[]' // flashcards_list (empty json)
        ];

        const result = await query(insertQuery, values);

        console.log('✅ Lesson 1 inserted/updated successfully.');
        console.log('Lesson ID:', result.rows[0].id);
        console.log('Lesson Title:', result.rows[0].title);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error inserting/updating lesson:', error);
        process.exit(1);
    }
};

insertDay1();
