const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists (by email OR username)
        let user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (user) {
            const field = user.email === email ? "Email" : "Username";
            return res.status(400).json({ message: `${field} already exists` });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        console.log(`User registered: ${email}`);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        // Handle MongoDB duplicate key error specifically if it somehow passes the initial check
        if (err.code === 11000) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }
        res.status(500).json({ message: "Server error during registration" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Create JWT
        // Uses the JWT_SECRET from your .env / Render Environment Variables
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send token back to frontend
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = router;