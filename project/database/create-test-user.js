import pg from 'pg';
import bcrypt from 'bcryptjs';
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

async function createTestUser() {
    const client = new pg.Client(config);

    try {
        console.log('🔄 Connecting to database...');
        await client.connect();

        const email = 'admin@example.com';
        const password = 'password123';

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        console.log(`👤 Creating test user: ${email}`);

        const result = await client.query(
            `INSERT INTO users (email, password_hash, full_name, password_changed) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
            [email, passwordHash, 'Admin User', false]
        );

        const userId = result.rows[0].id;

        // Create profile
        await client.query(
            `INSERT INTO user_profiles (user_id, current_level, current_day) 
       VALUES ($1, $2, $3)`,
            [userId, 'A1', 1]
        );

        console.log('✅ Test user created successfully!');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);

    } catch (error) {
        if (error.code === '23505') {
            console.log('⚠️ User already exists. Try logging in.');
        } else {
            console.error('❌ Error:', error);
        }
    } finally {
        await client.end();
    }
}

createTestUser();
