const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pasteRoutes = require('./routes/pasteRoutes');
const connectDB = require('./config/dbConnect');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

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
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

app.listen(PORT, () => {
    console.log(`PasteBox server running on port ${PORT}`);
});