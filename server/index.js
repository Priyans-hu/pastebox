const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const pasteRoutes = require('./routes/pasteRoutes');
const connectDB = require('./config/dbConnect');
const cors = require('cors');

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = ['http://localhost:5000', 'http://localhost:3000', ];

const corsOptions = {
    origin: (origin, callback) => {
        const isAllowed = allowedOrigins.includes(origin) || !origin;
        callback(null, isAllowed);
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); 

app.use('/api', pasteRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});