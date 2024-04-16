// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// instantiate an express app
const app = express();

// declare a port
const PORT = process.env.PORT || 8080;

// middleware
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.send('healthy');
});

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});