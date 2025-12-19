
import { query } from './config/database.js';
import fs from 'fs';
import path from 'path';

const importHybridDay1 = async () => {
    console.log('🚀 Importing Real Day 1 Data into Hybrid Schema...');

    try {
        // 1. Read the JSON file
        const jsonPath = path.join(process.cwd(), 'day1_full_data.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error('day1_full_data.json not found!');
        }
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(fileContent);
        const day01 = data.day_01_data;

        const lessonData = day01.lessons[0]; // Assuming one lesson per file for now
        const vocabularyList = day01.vocabulary || [];
        const exercisesList = day01.exercises || [];

        // 2. Generate Flashcards from Vocabulary (Front: Word, Back: Translation)
        const flashcardsList = vocabularyList.map(v => ({
            front: v.word,
            back: v.translation,
            // optional: category or example
        }));

        console.log(`📝 Preparing Lesson: ${lessonData.title}`);
        console.log(`   - Vocabulary count: ${vocabularyList.length}`);
        console.log(`   - Flashcards generated: ${flashcardsList.length}`);
        console.log(`   - Exercises count: ${exercisesList.length}`);

        // 3. Insert into DB
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
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, NOW()
            )
            ON CONFLICT (day_number) DO UPDATE SET 
                title = EXCLUDED.title,
                level = EXCLUDED.level,
                description = EXCLUDED.description,
                grammar_topic = EXCLUDED.grammar_topic,
                reading_text = EXCLUDED.reading_text,
                video_url = EXCLUDED.video_url,
                image_url = EXCLUDED.image_url,
                vocabulary_list = EXCLUDED.vocabulary_list,
                quiz_list = EXCLUDED.quiz_list,
                flashcards_list = EXCLUDED.flashcards_list,
                updated_at = NOW()
            RETURNING id;
        `;

        const values = [
            lessonData.day_number,
            lessonData.title,
            lessonData.level,
            lessonData.description,
            lessonData.grammar_topic,
            "See Google Doc below...", // grammar_content (placeholder or text if available)
            lessonData.reading_text,
            lessonData.video_url,
            lessonData.image_url,
            JSON.stringify(vocabularyList),
            JSON.stringify(exercisesList),
            JSON.stringify(flashcardsList)
        ];

        const res = await query(insertQuery, values);
        console.log(`✅ Lesson imported successfully. ID: ${res.rows[0].id}`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error importing hybrid data:', error);
        process.exit(1);
    }
};

importHybridDay1();
