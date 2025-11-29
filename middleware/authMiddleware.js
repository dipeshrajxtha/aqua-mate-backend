const jwt = require('jsonwebtoken'); 
const User = require('../models/user'); 

/**
 * Middleware to protect routes by verifying a JWT sent in the Authorization header.
 * It ensures the token is present, valid, and not expired,
 * and attaches the authenticated user object (without the password) to req.user.
 */
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if the token is present in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token string from the "Bearer <token>" format
            token = req.headers.authorization.split(' ')[1]; 
            
            if (!token || token === 'undefined' || token === 'null') {
                return res.status(401).json({ message: 'Not authorized, token value is missing or invalid.' });
            }

            // 2. Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 

            // 3. Find the user based on the decoded ID
            const user = await User.findById(decoded.id).select('-password'); 
            
            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }
            
            // 4. Attach the user object to the request for access in controllers
            req.user = user; 
            next();

        } catch (error) {
            // This line is around the one reported (line 30)
            console.error('Auth Middleware Error:', error); 
            // Handle token failure (e.g., signature invalid, expired)
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    } else {
        // If no token is provided in the header
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};