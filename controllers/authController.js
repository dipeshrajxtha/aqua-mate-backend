// controllers/authController.js - Contains the core logic for auth operations

const User = require('../models/user'); 
const jwt = require('jsonwebtoken'); 
const jwtSecret = process.env.JWT_SECRET;

// Helper function to generate a JWT
const generateToken = (id) => {
    if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable is not set.");
    }
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '30d', 
    });
};

// --- User Registration Logic ---
exports.register = async (req, res) => {
    const { fullName, email, password, gender, dob } = req.body;

    if (!email || !password || !fullName || !gender || !dob) {
        return res.status(400).json({ message: 'Missing required fields: full name, email, password, gender, and date of birth.' });
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
            dob: new Date(dob), 
        });

        await user.save();

        res.status(201).json({ 
            message: 'User registered successfully. Please log in.',
            userId: user._id,
        });

    } catch (err) {
        // Handles Mongoose errors caught from the model layer
        console.error('Registration Error:', err); 

        let message = 'An unexpected server error occurred during registration.';
        
        if (err.name === 'ValidationError') {
             message = 'Validation failed: ' + Object.values(err.errors).map(val => val.message).join(', ');
             return res.status(400).json({ message }); 
        }
        
        if (err.code === 11000) {
            message = 'A user with this email already exists.';
            return res.status(409).json({ message });
        }

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

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials (Incorrect password).' });
        }

        // Generate the JWT token upon successful login
        const token = generateToken(user._id);

        // Respond with the token and user data
        res.status(200).json({
            message: 'Login successful.',
            token: token, 
            userId: user._id,
            fullName: user.fullName,
            gender: user.gender,
            dob: user.dob,
            profilePicture: user.profilePicture
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login.', error: err.message });
    }
};