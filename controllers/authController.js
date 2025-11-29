// controllers/authController.js - Contains the core logic for auth operations

// NOTE: This file assumes User model path is correct relative to its location
const User = require('../models/user'); 

// --- User Registration Logic ---
exports.register = async (req, res) => {
    const { fullName, email, password, gender, dob } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'Please provide full name, email, and password.' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists with this email address.' });
        }

        user = new User({
            fullName,
            email,
            password,
            gender,
            dob,
        });

        await user.save();

        res.status(201).json({ 
            message: 'User registered successfully. Please log in.',
            userId: user._id,
        });

    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ message: 'Server error during registration.', error: err.message });
    }
};

// --- User Login Logic ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // Need to explicitly select password for matching
        const user = await User.findOne({ email }).select('+password'); 
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (Email not found).' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (Incorrect password).' });
        }

        // 🚨 CRITICAL FIX: Include all necessary user data in the response
        res.status(200).json({
            message: 'Login successful.',
            userId: user._id,
            fullName: user.fullName,
            gender: user.gender, // <-- ADDED for Flutter profile
            dob: user.dob,       // <-- ADDED for Flutter profile
            profilePicture: user.profilePicture // <-- ADDED for Flutter profile
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login.', error: err.message });
    }
};