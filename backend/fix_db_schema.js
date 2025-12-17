
import { query } from './config/database.js';

const fixSchema = async () => {
    console.log('🔧 Starting database schema repair...');
    try {
        // 1. Remove duplicates before adding unique constraint
        console.log('🧹 Removing duplicates from lesson_progress...');
        await query(`
            DELETE FROM lesson_progress a USING lesson_progress b
            WHERE a.id < b.id 
            AND a.user_id = b.user_id 
            AND a.day_number = b.day_number;
        `);

        // 2. Add Unique Constraint on (user_id, day_number)
        console.log('➕ Adding UNIQUE constraint on (user_id, day_number)...');
        try {
            await query(`
                ALTER TABLE lesson_progress 
                ADD CONSTRAINT lesson_progress_user_day_unique UNIQUE (user_id, day_number);
            `);
            console.log('✅ Constraint added successfully.');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('ℹ️ Constraint already exists.');
            } else {
                console.error('⚠️ Failed to add constraint:', error.message);
                // Try dropping the old one if it exists with a different name or structure?
                // Probably safer to just stop here, knowing the user might run this multiple times.
            }
        }

        console.log('✨ Schema repair completed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ specific error:', error);
        process.exit(1);
    }
};

fixSchema();
