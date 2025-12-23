import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import webhookRoutes from './routes/webhook.js';
import lessonRoutes from './routes/lessons.js';

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Request Logger
app.use((req, res, next) => {
    console.log(`🔔 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    // console.log('Headers:', JSON.stringify(req.headers)); // Reduced noise
    next();
});

// Cookie parser
app.use(cookieParser());

// Enable CORS with credentials
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true // Allow cookies to be sent
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/lessons', lessonRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve STATIC FILES in Production
// This is critical for Monolith deployments (e.g. Railway, Heroku)
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const frontendDist = path.join(__dirname, '../project/dist');

    console.log(`📂 Serving static files from: ${frontendDist}`);

    app.use(express.static(frontendDist));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        if (!req.url.startsWith('/api')) {
            res.sendFile(path.resolve(frontendDist, 'index.html'));
        } else {
            res.status(404).json({ success: false, message: 'API Route not found' });
        }
    });
} else {
    // 404 handler for API-only mode (Dev)
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Route not found',
            path: req.originalUrl
        });
    });
}

// Global Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🚀 Server running on port ${PORT}      ║
║   📝 Environment: ${process.env.NODE_ENV || 'development'}         ║
║   🌐 Frontend URL: ${process.env.FRONTEND_URL}  ║
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`❌ Error: ${err.message}`);
    process.exit(1);
});
