
import { query } from './config/database.js';
import fs from 'fs';
import path from 'path';

const importFullDay1 = async () => {
    console.log('🚀 Importing Full Day 1 Data...');

    try {
        const jsonPath = path.join(process.cwd(), 'day1_full_data.json');
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(fileContent);

        const day01 = data.day_01_data;

        // 1. Disable triggers if any (optional, but good for bulk import)

        // --- Import Lessons ---
        let lessonId = null;
        for (const lesson of day01.lessons) {
            console.log(`📝 Processing Lesson Day ${lesson.day_number}: ${lesson.title}`);

            const queryText = `
                INSERT INTO lessons (
                    day_number, level, title, description, grammar_topic, 
                    reading_text, video_url, image_url, updated_at
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
                lesson.day_number, lesson.level, lesson.title, lesson.description, lesson.grammar_topic,
                lesson.reading_text, lesson.video_url, lesson.image_url
            ];

            const res = await query(queryText, values);
            lessonId = res.rows[0].id;
            console.log(`   ✅ Lesson Saved (ID: ${lessonId})`);
        }

        if (!lessonId) {
            console.error('❌ Failed to get Lesson ID. Aborting.');
            process.exit(1);
        }

        // --- Import Vocabulary ---
        if (day01.vocabulary && day01.vocabulary.length > 0) {
            console.log(`📚 Processing ${day01.vocabulary.length} Vocabs...`);

            for (const vocab of day01.vocabulary) {
                // Upsert vocabulary
                // Assuming unique constraint on (lesson_id, word)
                await query(`
                    INSERT INTO vocabulary (lesson_id, word, translation, category, created_at)
                    VALUES ($1, $2, $3, $4, NOW())
                    ON CONFLICT (lesson_id, word) DO UPDATE 
                    SET translation = EXCLUDED.translation, category = EXCLUDED.category;
                `, [lessonId, vocab.word, vocab.translation, vocab.category]);
            }
            console.log('   ✅ Vocabulary imported.');
        }

        // --- Import Exercises ---
        if (day01.exercises && day01.exercises.length > 0) {
            console.log(`❓ Processing ${day01.exercises.length} Exercises...`);

            // For exercises, since we don't have a unique key easily (question text can change slightly), 
            // we might want to clear existing exercises for this lesson first to avoid duplicates if re-running.
            // OR we just append. Let's CLEAR first for this lesson to be clean.
            await query('DELETE FROM exercises WHERE lesson_id = $1', [lessonId]);
            console.log('   Warning: Cleared old exercises for this lesson to ensure fresh import.');

            for (const ex of day01.exercises) {
                await query(`
                    INSERT INTO exercises (
                        lesson_id, type, question, options, correct_answer, explanation, created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
                `, [
                    lessonId,
                    ex.type,
                    ex.question,
                    JSON.stringify(ex.options),
                    ex.correct_answer,
                    ex.explanation
                ]);
            }
            console.log('   ✅ Exercises imported.');
        }

        console.log('✨ Full Day 1 Import Completed Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error full import:', error);
        process.exit(1);
    }
};

importFullDay1();
