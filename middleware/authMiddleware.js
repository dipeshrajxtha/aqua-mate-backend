// middleware/authMiddleware.js

// CRITICAL FIX: Ensure correct path casing for Linux/Render deployment
const User = require('../models/user'); 

// --- Placeholder Authentication Middleware ---
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if the token exists in the headers (e.g., "Bearer 12345")
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract the token/user ID
            token = req.headers.authorization.split(' ')[1]; 
            
            // FIX: Check for a valid extracted token immediately
            if (!token || token === 'undefined' || token === 'null') {
                 // If the header was present but the token part was missing/empty
                 return res.status(401).json({ message: 'Not authorized, token value is missing or invalid.' });
            }

            // 3. Find the user using the token (ID)
            const user = await User.findById(token).select('-password');
            
            // 4. Check if a user was found with that ID
            if (!user) {
                // If the user ID is valid but no user exists in the DB
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }
            
            // 5. Attach the user and move on
            req.user = user; 
            next(); // Move to the next middleware/controller

        } catch (error) {
            console.error('Auth Middleware Error:', error);
            // FIX: Catch any extraction or database lookup errors and return guaranteed JSON
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    } else {
        // 6. No token provided at all
        // FIX: Use 'return' to ensure the execution stops here and sends JSON
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};