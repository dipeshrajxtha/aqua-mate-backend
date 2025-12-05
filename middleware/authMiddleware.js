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
        console.log(`[AUTH] Token extracted: ${token}`); // <-- ADDED LOGGING
    }

    // Fallback: If no token in header, you might check other places (not recommended)
    if (!token) {
        console.log('[AUTH] Error: No token found in Authorization header.'); // <-- ADDED LOGGING
        return res.status(401).json({ message: 'Not authorized, no token provided in the Authorization header.' });
    }

    try {
        // 2. We are assuming the token IS the user's MongoDB ID
        const userId = token;
        
        // Check if the token looks like a valid MongoDB ObjectId (24 hex characters)
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log(`[AUTH] Error: Token ${userId} is not a valid 24-char MongoDB ID.`); // <-- ADDED LOGGING
             return res.status(401).json({ message: 'Not authorized, token provided is malformed and cannot be processed.' });
        }
        
        const user = await User.findById(userId).select('-password');
        
        // 3. Check if a user was found with that ID
        if (!user) {
            console.log(`[AUTH] Error: Valid looking ID ${userId} did not match any user.`); // <-- ADDED LOGGING
            return res.status(401).json({ message: 'Not authorized, user ID (token) is valid format but user not found.' });
        }
        
        // 4. Attach the user object (including ID) to the request
        req.user = user; 
        console.log(`[AUTH] Success: User ${user.email} (ID: ${userId}) authenticated.`); // <-- ADDED LOGGING
        next(); // Move to the controller

    } catch (error) {
        // This catches malformed IDs that Mongoose can't look up, or unexpected database errors
        console.error('[AUTH] Catch Error:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed validation (likely an internal server or DB error).' });
    }
};