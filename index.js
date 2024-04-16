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
const SALT_ROUNDS = 10;

// middleware
app.use(express.json());

// GET - /api/health - checks if API is alive
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

// create user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// create user model
const User = mongoose.model('User', userSchema);

// REGISTER ENDPOINT
// POST - /api/register - creates a new user
app.post("/api/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        const newUser = await user.save();
        res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// server listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});