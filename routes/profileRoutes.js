// routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Route for updating the user profile
// It requires the 'protect' middleware for authentication first, 
// then the 'upload' middleware to handle the 'profilePicture' file.
router.put(
    '/update', 
    protect, 
    upload.single('profilePicture'), // 🚨 CRITICAL: Field name MUST match Flutter's: 'profilePicture'
    profileController.updateProfile
);

// You can add other profile routes here (e.g., GET /api/profile)

module.exports = router;