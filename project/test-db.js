import { query } from './src/lib/db.js';

async function testConnection() {
    try {
        console.log('🔄 Testing database connection...');
        console.log('Host:', process.env.VITE_DB_HOST || 'Not set');
        console.log('Port:', process.env.VITE_DB_PORT || 'Not set');
        console.log('Database:', process.env.VITE_DB_NAME || 'Not set');
        console.log('User:', process.env.VITE_DB_USER || 'Not set');
        console.log('SSL:', process.env.VITE_DB_SSL || 'Not set');
        console.log('---');

        const result = await query('SELECT NOW() as current_time, version() as pg_version');

        console.log('✅ Database connection successful!');
        console.log('Current time from database:', result.rows[0].current_time);
        console.log('PostgreSQL version:', result.rows[0].pg_version);

        // Test a simple query
        const testQuery = await query('SELECT 1 + 1 as result');
        console.log('Test calculation (1+1):', testQuery.rows[0].result);

        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed!');
        console.error('Error:', error.message);
        console.error('---');
        console.error('Please check:');
        console.error('1. Is the password correct in .env file?');
        console.error('2. Is the pg package installed? (npm install pg)');
        console.error('3. Is the database accessible from your network?');
        console.error('4. Are all environment variables set correctly?');
        process.exit(1);
    }
}

testConnection();
