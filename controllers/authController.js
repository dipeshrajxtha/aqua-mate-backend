const User = require('../models/user'); 

// Helper function to return user data and token
const sendTokenResponse = (user, statusCode, res) => {
    // Generates the token using the method defined in the User model
    const token = user.getSignedJwtToken(); 

    res.status(statusCode).json({
        message: 'Login successful.',
        userId: user._id,
        fullName: user.fullName,
        gender: user.gender,
        dob: user.dob,
        profilePicture: user.profilePicture,
        token: token, // CRITICAL FIX: Include the token
    });
};

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

        // Send token immediately after registration
        sendTokenResponse(user, 201, res);

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
        const user = await User.findOne({ email }).select('+password'); 
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Do not expose if it's email or password error
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // CRITICAL FIX: Send token response
        sendTokenResponse(user, 200, res);

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login.', error: err.message });
    }
};