import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
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

async function runMigration() {
    const client = new pg.Client(config);

    try {
        console.log('🔄 Connecting to database...');
        console.log(`📍 Host: ${config.host}`);
        console.log(`📍 Database: ${config.database}`);
        console.log(`📍 User: ${config.user}`);
        console.log('---');

        await client.connect();
        console.log('✅ Connected to database successfully!\n');

        // Read the SQL file
        const sqlFilePath = path.join(__dirname, 'schema.sql');
        console.log(`📄 Reading SQL file: ${sqlFilePath}`);

        if (!fs.existsSync(sqlFilePath)) {
            throw new Error(`SQL file not found: ${sqlFilePath}`);
        }

        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('✅ SQL file loaded successfully!\n');

        console.log('🚀 Executing migration...');
        console.log('---');

        // Execute the SQL
        await client.query(sql);

        console.log('---');
        console.log('✅ Migration completed successfully!');
        console.log('\n📊 Verifying tables...');

        // Verify tables were created
        const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

        console.log('\n✅ Tables created:');
        result.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        console.log('\n🎉 Database setup complete!');

    } catch (error) {
        console.error('\n❌ Migration failed!');
        console.error('Error:', error.message);

        if (error.code) {
            console.error('Error Code:', error.code);
        }

        console.error('\n💡 Troubleshooting:');
        console.error('1. Check if password is correct in .env file');
        console.error('2. Verify database connection details');
        console.error('3. Make sure the database exists');
        console.error('4. Check if you have proper permissions');

        process.exit(1);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the migration
runMigration();
