// routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Multer instance
const multer = require('multer'); // Need to import multer to check its errors

// 🚨 CRITICAL FIX: Custom error handler for Multer to prevent "TypeError: next is not a function"
const multerErrorHandler = (req, res, next) => {
    // 1. Run the actual Multer middleware
    upload.single('profilePicture')(req, res, (err) => {
        
        // 2. Check for Multer-specific errors (e.g., file size limit, field name mismatch)
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err.message);
            // Return a clean 400 Bad Request JSON response
            return res.status(400).json({ message: 'File upload error (Multer).', details: err.message });
        }
        
        // 3. Check for general errors (e.g., file filter failure)
        if (err) {
            console.error('General File Upload Error:', err.message);
            // Return a clean 400 Bad Request JSON response
            return res.status(400).json({ message: 'File validation failed.', details: err.message });
        }
        
        // 4. If no error, call next() to pass control to the controller
        next();
    });
};

// Route for updating the user profile
// Note: This matches the Flutter client's use of the PUT method.
router.put(
    '/update', 
    protect, 
    multerErrorHandler, // <-- Use the error-handling wrapper here
    profileController.updateProfile // This controller no longer receives next(err) and won't crash
);

module.exports = router;