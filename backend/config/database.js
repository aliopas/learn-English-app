import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Force disable SSL certificate validation for this process
// This resolves "self-signed certificate in certificate chain" errors on Railway/Render
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;

// PostgreSQL connection pool
const isProduction = process.env.NODE_ENV === 'production';

let dbConfig;

if (process.env.DATABASE_URL) {
    dbConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
} else {
    dbConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: (process.env.DB_SSL === 'true' || isProduction) ? { rejectUnauthorized: false } : false,
    };
}

console.log(`🔌 Database Config: Using ${process.env.DATABASE_URL ? 'Connection String' : 'Individual Params'}`);
console.log(`🔒 SSL Mode: ${JSON.stringify(dbConfig.ssl)}`);

const pool = new Pool({
    ...dbConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Test connection
pool.on('connect', () => {
    console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
});

// Helper function to execute queries
export const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

export default pool;
