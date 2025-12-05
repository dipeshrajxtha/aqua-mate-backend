// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Extract Bearer token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            message: 'Not authorized, no token provided'
        });
    }

    try {
        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user (without password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                message: 'Not authorized, user not found'
            });
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({
            message: 'Not authorized, token invalid or expired'
        });
    }
});
