
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') }); // Point to project root .env

// Import data generator
// Note: We access the src folder from the database folder
import { generateLearningPath } from '../src/data/learningData.js';

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

async function seed() {
    const client = new pg.Client(config);

    try {
        console.log('🌱 Starting Seed Process...');
        await client.connect();
        console.log('✅ Connected to Database');

        // 1. Clear existing content data to avoid duplicates
        console.log('🧹 Clearing existing lessons, vocabulary, and exercises...');
        await client.query('TRUNCATE lessons CASCADE');
        // Vocabulary and Exercises will be deleted automatically due to CASCADE

        // 2. Generate Data
        console.log('📦 Generating Learning Path Data...');
        const learningPath = generateLearningPath();
        console.log(`📝 Found ${learningPath.length} days of content.`);

        // 3. Insert Data
        for (const day of learningPath) {
            console.log(`\nProcessing Day ${day.day} (${day.level})...`);

            // A. Insert Lesson
            // Map JS fields to DB columns
            const grammarTopic = day.grammar ? day.grammar.topic : null;
            const grammarContent = day.grammar ? day.grammar.description : null;
            const readingText = day.readingExercise ? (typeof day.readingExercise === 'string' ? day.readingExercise : day.readingExercise.text) : null;

            const insertLessonQuery = `
                INSERT INTO lessons (
                    day_number, level, title, description, 
                    grammar_topic, grammar_content, reading_text, 
                    video_url, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                RETURNING id;
            `;

            const lessonResult = await client.query(insertLessonQuery, [
                day.day,
                day.level,
                day.title,
                day.description,
                grammarTopic,
                grammarContent,
                readingText,
                day.videoUrl
            ]);

            const lessonId = lessonResult.rows[0].id;
            console.log(`   - Created Lesson ID: ${lessonId}`);

            // B. Insert Vocabulary
            if (day.vocabulary && day.vocabulary.length > 0) {
                let vocabCount = 0;
                for (const vocab of day.vocabulary) {
                    await client.query(`
                        INSERT INTO vocabulary (lesson_id, word, translation, example, category)
                        VALUES ($1, $2, $3, $4, $5)
                    `, [lessonId, vocab.word, vocab.translation, vocab.example, vocab.category]);
                    vocabCount++;
                }
                console.log(`   - Inserted ${vocabCount} vocabulary words`);
            }

            // C. Insert Exercises
            if (day.exercises && day.exercises.length > 0) {
                let exCount = 0;
                for (const ex of day.exercises) {
                    // Fix naming: JS 'correctAnswer' -> DB 'correct_answer'
                    // ensure options is JSON string or array (pg handles array automatically if type is jsonb)

                    await client.query(`
                        INSERT INTO exercises (
                            lesson_id, type, question, options, 
                            correct_answer, explanation, difficulty
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `, [
                        lessonId,
                        ex.type || 'unknown',
                        ex.question,
                        JSON.stringify(ex.options || []),
                        String(ex.correctAnswer), // Ensure string
                        ex.explanation,
                        ex.difficulty
                    ]);
                    exCount++;
                }
                console.log(`   - Inserted ${exCount} exercises`);
            }
        }

        console.log('\n✨ Seeding Completed Successfully! ✨');

    } catch (err) {
        console.error('\n❌ Seeding Failed:', err);
    } finally {
        await client.end();
    }
}

seed();
