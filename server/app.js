const express = require('express');
const cors = require('cors');
const pasteRoutes = require('./routes/pasteRoutes');
const { getCacheStats } = require('./config/redis');

const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:3000',
    process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
    const cacheStats = await getCacheStats();
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        cache: {
            enabled: cacheStats.enabled,
            connected: cacheStats.connected || false
        }
    });
});

// API routes
app.use('/api', pasteRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
