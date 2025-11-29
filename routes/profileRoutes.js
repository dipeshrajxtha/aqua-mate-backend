// routes/profileRoutes.js - Handles profile update operations

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you'll add authentication later
const upload = require('../middleware/uploadMiddleware'); // Multer middleware

// PUT /api/profile/update
// Handles updates to profile details, including file upload
// We'll use a simple placeholder for authentication for now.
router.put('/update', upload.single('profilePicture'), profileController.updateProfile);

module.exports = router;