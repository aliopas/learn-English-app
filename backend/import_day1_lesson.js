
import { query } from './config/database.js';
import fs from 'fs';
import path from 'path';

const importDay1Lesson = async () => {
    console.log('🚀 Importing Day 1 Lesson Content...');

    try {
        const jsonPath = path.join(process.cwd(), 'day1_lesson.json');
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const lessons = data.day_01_data.lessons;

        for (const lesson of lessons) {
            console.log(`Processing Lesson Day ${lesson.day_number}: ${lesson.title}`);

            // Insert or Update the lesson
            const queryText = `
                INSERT INTO lessons (
                    day_number, 
                    level, 
                    title, 
                    description, 
                    grammar_topic, 
                    reading_text, 
                    video_url, 
                    image_url,
                    updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                ON CONFLICT (day_number) 
                DO UPDATE SET 
                    level = EXCLUDED.level,
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    grammar_topic = EXCLUDED.grammar_topic,
                    reading_text = EXCLUDED.reading_text,
                    video_url = EXCLUDED.video_url,
                    image_url = EXCLUDED.image_url,
                    updated_at = NOW()
                RETURNING id;
            `;

            const values = [
                lesson.day_number,
                lesson.level,
                lesson.title,
                lesson.description,
                lesson.grammar_topic,
                lesson.reading_text,
                lesson.video_url,
                lesson.image_url
            ];

            const res = await query(queryText, values);
            console.log(`✅ Lesson imported successfully with ID: ${res.rows[0].id}`);
        }

        console.log('✨ Import completed.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error importing lesson:', error);
        process.exit(1);
    }
};

importDay1Lesson();
