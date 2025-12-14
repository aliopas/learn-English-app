import dotenv from 'dotenv';

dotenv.config();

/** @type { import("drizzle-kit").Config } */
export default {
    schema: './database/schema.js',
    out: './database/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.VITE_DB_HOST,
        port: parseInt(process.env.VITE_DB_PORT || '5432'),
        user: process.env.VITE_DB_USER,
        password: process.env.VITE_DB_PASSWORD,
        database: process.env.VITE_DB_NAME,
        ssl: process.env.VITE_DB_SSL === 'true' ? {
            rejectUnauthorized: false
        } : false
    },
};
