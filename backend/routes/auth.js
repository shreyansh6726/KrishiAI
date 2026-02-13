const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Farmer
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, languagePreference } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, languagePreference });
        await newUser.save();
        res.status(201).json({ message: "Farmer registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Farmer
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, lang: user.languagePreference } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;