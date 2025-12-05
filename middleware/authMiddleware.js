const User = require('../models/user');

// 🔐 TEMPORARY AUTH MIDDLEWARE
// Using MongoDB user ID as the "token"
exports.protect = async (req, res, next) => {
    try {
        let token;

        // --- Extract Token ---
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
            console.log(`[AUTH] Extracted Token: ${token}`);
        }

        // --- No Token Found ---
        if (!token) {
            console.log('[AUTH] No token found in Authorization header.');
            return res.status(401).json({
                message: 'Not authorized: no token provided in the Authorization header.'
            });
        }

        // --- Validate MongoDB ObjectId Format ---
        if (!token.match(/^[0-9a-fA-F]{24}$/)) {
            console.log(`[AUTH] Invalid ID format: ${token}`);
            return res.status(401).json({
                message: 'Not authorized: token is malformed and cannot be processed.'
            });
        }

        // --- Lookup User ---
        const user = await User.findById(token).select('-password');

        if (!user) {
            console.log(`[AUTH] No user found for ID: ${token}`);
            return res.status(401).json({
                message: 'Not authorized: token format is valid but no user exists for this ID.'
            });
        }

        // --- Success ---
        req.user = user;
        console.log(`[AUTH] Authenticated: ${user.email} (ID: ${token})`);
        next();

    } catch (error) {
        console.error('[AUTH] Unexpected error:', error.message);
        return res.status(401).json({
            message: 'Not authorized: authentication failed due to server error.'
        });
    }
};
