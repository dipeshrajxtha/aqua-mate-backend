// controllers/profileController.js

// 🚨 CRITICAL FIX: Ensure correct path and casing for Linux/Render deployment
const User = require('../models/User'); 

// Placeholder to export profile update logic
exports.updateProfile = async (req, res) => {
  // The 'protect' middleware should have attached the user's ID to req.user
  const userId = req.body.userId || (req.user ? req.user._id : null); 

  if (!userId) {
    return res.status(401).json({ message: 'User ID not provided or unauthorized.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // --- 1. Update Text Fields ---
    user.fullName = req.body.fullName || user.fullName;
    user.dob = req.body.dob || user.dob;
    // Assuming gender is not currently editable, but should be handled here if it were.

    // --- 2. Handle File Upload (Multer result) ---
    if (req.file) {
      // Multer puts the file info in req.file.path
      // The path is relative to the server root (e.g., uploads/profilePicture-12345.jpg)
      
      // We store the relative path for the frontend to access later
      // E.g., /uploads/filename.jpg
      user.profilePicture = '/' + req.file.path.replace(/\\/g, "/"); 
    }
    
    // --- 3. Save Changes ---
    const updatedUser = await user.save();

    // --- 4. Return the Updated User Object (Exclude password) ---
    // The backend MUST return JSON for the Flutter app to not throw FormatException
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      profilePicture: updatedUser.profilePicture,
      // You may need to update the UserSession in Flutter with the full updated model
    });

  } catch (error) {
    console.error('Profile update error:', error);
    // 🚨 IMPORTANT: Ensure we always return a JSON error response, NOT let Express return HTML
    res.status(500).json({ message: 'Server error during profile update.', details: error.message });
  }
};