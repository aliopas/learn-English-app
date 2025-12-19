
import { query } from './config/database.js';

const cleanDatabase = async () => {
    console.log('🧹 Cleaning Database Content (preserving users)...');

    try {
        // We delete in order of dependencies (child tables first)

        // 1. Delete Progress & Tracking tables (User related but transient or linked to content)
        console.log(' - Deleting lesson_progress...');
        await query('DELETE FROM lesson_progress'); // Users keep accounts, but progress resets? Or user wants to keep progress? "Clean database" usually implies resetting content state.
        // User said "Clean database except users". Usually implies removing content (lessons, vocab) to re-import clearly.
        // But lessons are referenced by progress. We MUST delete progress if we delete lessons.

        console.log(' - Deleting vocabulary_progress...');
        await query('DELETE FROM vocabulary_progress');

        console.log(' - Deleting daily_tasks...');
        await query('DELETE FROM daily_tasks');

        // 2. Delete Content tables
        console.log(' - Deleting exercises...');
        await query('DELETE FROM exercises');

        console.log(' - Deleting vocabulary...');
        await query('DELETE FROM vocabulary');

        console.log(' - Deleting lessons...');
        await query('DELETE FROM lessons');

        // Note: We are NOT deleting 'users', 'user_profiles', 'registration_ips'

        // Reset sequences if needed (optional, but good for clean IDs)
        await query('ALTER SEQUENCE lessons_id_seq RESTART WITH 1');
        await query('ALTER SEQUENCE vocabulary_id_seq RESTART WITH 1');
        await query('ALTER SEQUENCE exercises_id_seq RESTART WITH 1');

        console.log('✨ Database content cleaned successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error cleaning database:', error);
        process.exit(1);
    }
};

cleanDatabase();
