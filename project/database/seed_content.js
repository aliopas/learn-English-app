
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
        await client.query('TRUNCATE lessons, vocabulary, exercises CASCADE');
        // Vocabulary and Exercises will be deleted automatically due to CASCADE

        // 2. Generate Data
        console.log('📦 Generating Learning Path Data...');
        const learningPath = generateLearningPath();
        console.log(`📝 Found ${learningPath.length} days of content.`);

        console.log('🌱 Seeding REAL content for Day 1 and Day 2 only...');

        // Filter to get only Day 1 and Day 2
        const daysToSeed = learningPath.filter(day => day.day === 1 || day.day === 2);
        console.log(`📝 Processing ${daysToSeed.length} days of content.`);

        // 3. Insert Data
        for (const day of daysToSeed) {
            console.log(`\nProcessing Day ${day.day} (${day.level})...`);

            // A. Insert Lesson
            // Map JS fields to DB columns
            const grammarTopic = day.grammar ? day.grammar.topic : null;
            const grammarContent = day.grammar ? day.grammar.description : null;
            const readingText = day.readingExercise ? (typeof day.readingExercise === 'string' ? day.readingExercise : day.readingExercise.text) : null;

            const insertLessonQuery = `
                INSERT INTO lessons (
                    day_number, level, title, description, 
                    grammar_topic, document_content, reading_text, 
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
                grammarContent, // This variable holds the description, which we are now putting into document_content
                readingText,
                day.videoUrl
            ]);

            const lessonId = lessonResult.rows[0].id;
            console.log(`   - Created Lesson ID: ${lessonId}`);

            // B. Insert Vocabulary (10 words in one row per day)
            if (day.vocabulary && day.vocabulary.length >= 10) {
                const v = day.vocabulary; // Array of 10 words
                await client.query(`
                    INSERT INTO vocabulary (
                        day_number, 
                        word, translation, example,
                        word1, translation1, example1,
                        word2, translation2, example2,
                        word3, translation3, example3,
                        word4, translation4, example4,
                        word5, translation5, example5,
                        word6, translation6, example6,
                        word7, translation7, example7,
                        word8, translation8, example8,
                        word9, translation9, example9
                    ) VALUES (
                        $1, 
                        $2, $3, $4,
                        $5, $6, $7,
                        $8, $9, $10,
                        $11, $12, $13,
                        $14, $15, $16,
                        $17, $18, $19,
                        $20, $21, $22,
                        $23, $24, $25,
                        $26, $27, $28,
                        $29, $30, $31
                    )
                `, [
                    day.day, // Use day number instead of lessonId
                    v[0].word, v[0].translation, v[0].example,
                    v[1].word, v[1].translation, v[1].example,
                    v[2].word, v[2].translation, v[2].example,
                    v[3].word, v[3].translation, v[3].example,
                    v[4].word, v[4].translation, v[4].example,
                    v[5].word, v[5].translation, v[5].example,
                    v[6].word, v[6].translation, v[6].example,
                    v[7].word, v[7].translation, v[7].example,
                    v[8].word, v[8].translation, v[8].example,
                    v[9].word, v[9].translation, v[9].example
                ]);
                console.log(`   - Inserted 10 vocabulary words for Day ${day.day}`);
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
