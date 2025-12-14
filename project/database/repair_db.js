
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load env vars from the project root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

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

async function repair() {
    const client = new pg.Client(config);
    try {
        await client.connect();
        console.log('Connected to DB');

        // ==========================================
        // STEP 1: ADD MISSING COLUMNS (SAFE)
        // ==========================================
        console.log('Step 1: Checking columns...');

        try {
            await client.query(`ALTER TABLE vocabulary_progress ADD COLUMN IF NOT EXISTS level text DEFAULT 'A1'`);
            console.log('- level column checked/added to vocabulary_progress');
        } catch (e) { console.log('Error adding level:', e.message); }

        try {
            await client.query(`ALTER TABLE vocabulary_progress ADD COLUMN IF NOT EXISTS translation text`);
            await client.query(`ALTER TABLE vocabulary_progress ADD COLUMN IF NOT EXISTS mastery_level integer DEFAULT 0`);
            await client.query(`ALTER TABLE vocabulary_progress ADD COLUMN IF NOT EXISTS next_review_date timestamptz DEFAULT now()`);
            await client.query(`ALTER TABLE vocabulary_progress ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0`);
            await client.query(`ALTER TABLE vocabulary_progress ADD COLUMN IF NOT EXISTS correct_count integer DEFAULT 0`);
            await client.query(`ALTER TABLE vocabulary_progress ADD COLUMN IF NOT EXISTS last_reviewed_at timestamptz`);
            console.log('- Other vocabulary_progress columns checked/added');
        } catch (e) { console.log('Error adding vocabulary columns:', e.message); }

        try {
            await client.query(`ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS saved_answers jsonb`);
            await client.query(`ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now()`);
            console.log('- lesson_progress columns checked/added');
        } catch (e) { console.log('Error adding lesson_progress columns:', e.message); }

        try {
            await client.query(`ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS listening_score integer DEFAULT 0`);
            await client.query(`ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS reading_score integer DEFAULT 0`);
            await client.query(`ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS speaking_score integer DEFAULT 0`);
            await client.query(`ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS grammar_score integer DEFAULT 0`);
            console.log('- user_profiles columns checked/added');
        } catch (e) { console.log('Error adding user_profiles columns:', e.message); }

        try {
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false`);
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz`);
            console.log('- users columns checked/added');
        } catch (e) { console.log('Error adding users columns:', e.message); }


        // ==========================================
        // STEP 2: RE-CREATE NEW TABLES (DROP FIRST TO FIX TYPE MISMATCH)
        // ==========================================
        console.log('\nStep 2: Re-creating new content tables...');

        // We drop these specific tables to ensure they are created with the correct Schema (Integer IDs)
        // This fixes the "incompatible types: integer and uuid" error if they were created incorrectly before.
        await client.query(`DROP TABLE IF EXISTS exercises CASCADE`);
        await client.query(`DROP TABLE IF EXISTS vocabulary CASCADE`);
        await client.query(`DROP TABLE IF EXISTS lessons CASCADE`);

        // Lessons
        await client.query(`
            CREATE TABLE lessons (
                id SERIAL PRIMARY KEY,
                day_number INTEGER NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 30),
                level TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                grammar_topic TEXT,
                grammar_content TEXT,
                reading_text TEXT,
                video_url TEXT,
                image_url TEXT,
                created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
                updated_at TIMESTAMPTZ DEFAULT now()
            )
        `);
        console.log('- lessons table created (ID: SERIAL)');

        // Vocabulary Content
        await client.query(`
            CREATE TABLE vocabulary (
                id SERIAL PRIMARY KEY,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
                word TEXT NOT NULL,
                translation TEXT NOT NULL,
                example TEXT,
                category TEXT,
                created_at TIMESTAMPTZ DEFAULT now() NOT NULL
            )
        `);
        console.log('- vocabulary table created');

        // Exercises
        await client.query(`
            CREATE TABLE exercises (
                id SERIAL PRIMARY KEY,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
                type TEXT NOT NULL,
                question TEXT NOT NULL,
                options JSONB,
                correct_answer TEXT,
                explanation TEXT,
                difficulty TEXT,
                created_at TIMESTAMPTZ DEFAULT now() NOT NULL
            )
        `);
        console.log('- exercises table created');


        // ==========================================
        // STEP 3: CREATE INDEXES (ONLY IF COLUMNS EXIST)
        // ==========================================
        console.log('\nStep 3: Creating indexes...');

        try {
            await client.query(`CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON vocabulary_progress(user_id, level)`);
            console.log('- idx_vocabulary_level created');
        } catch (e) { console.log('Skipping idx_vocabulary_level (column might be missing):', e.message); }

        try {
            await client.query(`CREATE INDEX IF NOT EXISTS idx_vocabulary_next_review ON vocabulary_progress(user_id, next_review_date)`);
            console.log('- idx_vocabulary_next_review created');
        } catch (e) { console.log('Skipping idx_vocabulary_next_review:', e.message); }

        try {
            await client.query(`CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level)`);
            await client.query(`CREATE INDEX IF NOT EXISTS idx_lessons_day_number ON lessons(day_number)`);
            await client.query(`CREATE INDEX IF NOT EXISTS idx_vocabulary_lesson_id ON vocabulary(lesson_id)`);
            await client.query(`CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id)`);
            console.log('- Content table indexes created');
        } catch (e) { console.log('Error creating content indexes:', e.message); }


        console.log('\n✅ Repair process finished.');

    } catch (err) {
        console.error('Fatal Repair Error:', err);
    } finally {
        await client.end();
    }
}

repair();
