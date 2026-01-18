const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/dbConnect');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5000;

// Initialize database and cache
connectDB();
connectRedis();

app.listen(PORT, () => {
    console.log(`PasteBox server running on port ${PORT}`);
});