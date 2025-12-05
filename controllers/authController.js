// controllers/authController.js
// Handles user registration & login with JWT authentication

const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Make sure `.env` has JWT_SECRET defined
const jwtSecret = process.env.JWT_SECRET;

// Helper → Create JWT token
const generateToken = (id) => {
    if (!jwtSecret) {
        throw new Error("JWT_SECRET environment variable is not set.");
    }
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '30d',
    });
};

// ---------------------------
// 🚀 REGISTER USER
// ---------------------------
exports.register = async (req, res) => {
    const { fullName, email, password, gender, dob } = req.body;

    // Validate required fields
    if (!email || !password || !fullName || !gender || !dob) {
        return res.status(400).json({
            message: 'Missing required fields: full name, email, password, gender, and date of birth.'
        });
    }

    try {
        // Check if email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists with this email address.' });
        }

        // Create user
        user = new User({
            fullName,
            email,
            password,
            gender,
            dob: new Date(dob)
        });

        await user.save();

        // Registration successful
        res.status(201).json({
            message: 'User registered successfully. Please log in.',
            userId: user._id
        });

    } catch (err) {
        console.error('Registration Error:', err);

        // Validation (ex: missing fields in schema)
        if (err.name === 'ValidationError') {
            const message = 'Validation failed: ' +
                Object.values(err.errors).map(val => val.message).join(', ');
            return res.status(400).json({ message });
        }

        // Duplicate email error
        if (err.code === 11000) {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }

        res.status(500).json({
            message: 'An unexpected server error occurred during registration.',
            error: err.message
        });
    }
};

// ---------------------------
// 🔑 LOGIN USER (JWT)
// ---------------------------
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // Find user & include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials (Email not found).'
            });
        }

        // Compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials (Incorrect password).'
            });
        }

        // 🔥 Generate JWT
        const token = generateToken(user._id);

        // Successful login response
        res.status(200).json({
            message: 'Login successful.',
            token: token,
            user: {
                userId: user._id,
                fullName: user.fullName,
                gender: user.gender,
                dob: user.dob,
                profilePicture: user.profilePicture || null
            }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({
            message: 'Server error during login.',
            error: err.message
        });
    }
};
