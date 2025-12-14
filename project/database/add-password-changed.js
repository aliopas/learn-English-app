import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

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

async function addPasswordChangedColumn() {
    const client = new pg.Client(config);

    try {
        console.log('🔄 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!\n');

        // Check if column exists
        const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='password_changed';
    `);

        if (checkColumn.rows.length > 0) {
            console.log('✅ Column password_changed already exists!');
        } else {
            console.log('📝 Adding password_changed column...');
            await client.query(`
        ALTER TABLE users 
        ADD COLUMN password_changed boolean DEFAULT false NOT NULL;
      `);
            console.log('✅ Column added successfully!');
        }

        console.log('\n🎉 Migration complete!');

    } catch (error) {
        console.error('\n❌ Migration failed!');
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

addPasswordChangedColumn();
