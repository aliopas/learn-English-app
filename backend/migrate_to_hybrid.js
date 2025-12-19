
import { query } from './config/database.js';

const migrateToHybrid = async () => {
    console.log('🔄 Starting Hybrid Schema Migration...');

    try {
        // 1. Drop old tables
        console.log('🔥 Dropping old relational tables...');
        await query(`DROP TABLE IF EXISTS vocabulary_progress CASCADE`);
        await query(`DROP TABLE IF EXISTS lesson_progress CASCADE`);
        await query(`DROP TABLE IF EXISTS daily_tasks CASCADE`);
        await query(`DROP TABLE IF EXISTS vocabulary CASCADE`);
        await query(`DROP TABLE IF EXISTS exercises CASCADE`);
        await query(`DROP TABLE IF EXISTS lessons CASCADE`);

        // 2. Create new Hybrid Lessons Table
        console.log('🏗️ Creating new Hybrid lessons table...');
        await query(`
            CREATE TABLE lessons (
                id SERIAL PRIMARY KEY,
                day_number INTEGER NOT NULL UNIQUE,
                title TEXT NOT NULL,
                level TEXT DEFAULT 'A1',
                description TEXT,
                grammar_topic TEXT,
                grammar_content TEXT,
                reading_text TEXT,
                video_url TEXT,
                image_url TEXT,
                vocabulary_list JSONB DEFAULT '[]'::jsonb,
                quiz_list JSONB DEFAULT '[]'::jsonb,
                flashcards_list JSONB DEFAULT '[]'::jsonb,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // 3. Re-create dependent tables (we dropped them because of cascade/foreign keys)
        // We need lesson_progress to link to lessons(id) or just use day_number?
        // Original schema linked to lessons(id), but user wants simplified single row.
        // Let's re-create lesson_progress linking to the new lessons table.
        console.log('🏗️ Re-creating lesson_progress table...');
        await query(`
             CREATE TABLE lesson_progress (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
                day_number integer NOT NULL,
                lesson_id integer REFERENCES lessons(id) ON DELETE CASCADE,
                completed boolean DEFAULT false NOT NULL,
                score integer DEFAULT 0,
                time_spent_minutes integer DEFAULT 0,
                saved_answers jsonb,
                completed_at timestamptz,
                created_at timestamptz DEFAULT now(),
                updated_at timestamptz DEFAULT now(),
                UNIQUE(user_id, day_number)
            );
        `);

        // Re-create tasks if needed, though simpler is better.

        console.log('✅ Hybrid Schema Migration Completed.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    }
};

migrateToHybrid();
