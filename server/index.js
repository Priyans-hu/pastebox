const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const pasteRoutes = require('./routes/pasteRoutes');
const connectDB = require('./config/dbConnect');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

connectDB();

app.use('/api', pasteRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
