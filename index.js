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

// middleware to authenticate the JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // BEARER TOKEN

    if (token == null) return res.sendStatus(401); // no token was provided

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // token is invalid
        req.user = user;
        next();
    });
}

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

// LOGIN ENDPOINT
// POST - /api/login - logs in a user
app.post("/api/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
        return res.status(400).json({ message: "Cannot find user" });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: "Login successful", accessToken })
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PROTECTED ROUTE
// GET - /api/protected - a generic protected route
app.get("/api/protected", authenticateToken, async (req, res) => {
    try {
        const user = await User.find({ username: req.user.username });
        res.json({ message: "Protected route", user });
    } catch (error) {
        res.statusCode(500).json({ message: error.message });
    }
});

// server listening
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});