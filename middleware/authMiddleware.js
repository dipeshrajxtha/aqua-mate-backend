// middleware/authMiddleware.js

const User = require('./models/User');

// --- Placeholder Authentication Middleware ---
// NOTE: This is a placeholder. In a production app, this function
// should decode and verify a JSON Web Token (JWT) from the 'Authorization' header.
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if the token exists in the headers (e.g., "Bearer 12345")
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Extract the mock token (e.g., the user ID for testing)
            // In a real app, this would be: token = req.headers.authorization.split(' ')[1];
            token = req.headers.authorization.split(' ')[1]; 
            
            // 3. For now, we assume the token is the userId until JWT is implemented.
            // We'll use the token (ID) to find the user.
            const userId = token;

            if (!userId) {
                return res.status(401).json({ message: 'Not authorized, no token/ID provided.' });
            }

            // 4. Attach the user object (excluding the password) to the request
            // This allows subsequent controllers (like updateProfile) to know the user's ID
            req.user = await User.findById(userId).select('-password');
            
            // If the user isn't found, stop here
            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            next(); // Move to the next middleware/controller

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    } else {
        // No token provided at all
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};