// controllers/authController.js - Contains the core logic for auth operations

const User = require('../models/user'); 
const jwt = require('jsonwebtoken'); // Assuming you use JWT for session handling

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

        // This line is the most common source of unhandled Mongoose errors (e.g., failed pre-save hook)
        await user.save();

        // Respond with success message
        res.status(201).json({ 
            message: 'User registered successfully. Please log in.',
            userId: user._id,
        });

    } catch (err) {
        // 🔥 CRITICAL FIX: Log the entire error object instead of accessing err.message, 
        // which might be undefined and cause the internal 'next is not a function' crash.
        console.error('Registration Error:', err); 

        let message = 'Server error during registration.';
        
        // Handle Mongoose Validation Errors explicitly
        if (err.name === 'ValidationError') {
             // Create a readable message from validation errors
             message = 'Validation failed: ' + Object.values(err.errors).map(val => val.message).join(', ');
             return res.status(400).json({ message }); // Return 400 for client-side errors
        }
        
        // Handle Mongoose duplicate key error (if not handled by 409 above)
        if (err.code === 11000) {
            message = 'A user with this email already exists.';
            return res.status(409).json({ message });
        }

        // Default 500 internal server error
        res.status(500).json({ message: message, error: err.message });
    }
};

// --- User Login Logic ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        const user = await User.findOne({ email }).select('+password'); 
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (Email not found).' });
        }

        // Assuming user.matchPassword is defined in the model
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (Incorrect password).' });
        }

        // Generate JWT token (if using token-based auth)
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Respond with success
        res.status(200).json({
            message: 'Login successful.',
            userId: user._id,
            fullName: user.fullName,
            gender: user.gender,
            dob: user.dob,
            profilePicture: user.profilePicture
            // token: token, // If using JWT
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login.', error: err.message });
    }
};