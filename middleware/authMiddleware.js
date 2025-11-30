// middleware/authMiddleware.js
const User = require('../models/user'); // Ensure correct casing

// --- Temporary ID-as-Token Authentication Middleware ---
// NOTE: For production, this MUST be replaced by full JWT implementation.
exports.protect = async (req, res, next) => {
    let token;
    
    // 1. Check for the token in the Authorization header ("Bearer <ID>")
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]; 
    }

    // Fallback: If no token in header, you might check other places (not recommended)
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided in the Authorization header.' });
    }

    try {
        // 2. We are assuming the token IS the user's MongoDB ID
        const userId = token;
        
        const user = await User.findById(userId).select('-password');
        
        // 3. Check if a user was found with that ID
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user ID (token) is invalid or user not found.' });
        }
        
        // 4. Attach the user object (including ID) to the request
        req.user = user; 
        next(); // Move to the controller

    } catch (error) {
        console.error('Temporary Auth Middleware Error:', error);
        // This catches malformed IDs that Mongoose can't look up
        return res.status(401).json({ message: 'Not authorized, token failed validation (likely a malformed ID).' });
    }
};