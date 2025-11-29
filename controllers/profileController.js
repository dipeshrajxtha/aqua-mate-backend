// controllers/profileController.js

// 🚨 CRITICAL FIX 1: Correct path casing for Linux/Render deployment
// Must match the file name: User.js
const User = require('../models/user'); // CORRECTED CASING IS ASSUMED

// Placeholder to export profile update logic
exports.updateProfile = async (req, res) => {
  // 🚨 FIX 2: Prioritize req.user (from protect middleware) for security, 
  // then fall back to req.body.userId if the user object wasn't attached.
  const userId = req.user ? req.user._id : req.body.userId; 

  if (!userId) {
    // If we reach here, it means authentication failed or was incomplete.
    return res.status(401).json({ message: 'Authorization error: User ID not available for update.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // --- 1. Update Text Fields ---
    user.fullName = req.body.fullName || user.fullName;
    user.dob = req.body.dob || user.dob; // The format of req.body.dob is suspect

    // --- 2. Handle File Upload (Multer result) ---
    if (req.file) {
      user.profilePicture = '/' + req.file.path.replace(/\\/g, "/"); 
    }
    
    // --- 3. Save Changes ---
    const updatedUser = await user.save();

    // --- 4. Return the Updated User Object (Exclude password) ---
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      profilePicture: updatedUser.profilePicture,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    // 🚨 FINAL LOGIC FIX: Check for Mongoose Validation Errors (The likely cause of the 500)
    if (error.name === 'ValidationError') {
      // Catches errors like bad Date format for 'dob' or required fields missing
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
          message: 'Validation failed.', 
          details: messages.join(', ') 
      });
    }

    if (error.code && error.code === 11000) {
      // Catches MongoDB duplicate key error (for unique fields like email)
      return res.status(400).json({ message: 'Duplicate field value entered.' });
    }

    // Default 500 server error for all other unexpected crashes
    // We explicitly use 'return' to ensure the function exits and sends JSON
    return res.status(500).json({ 
        message: 'Server error during profile update.', 
        details: error.message 
    });
  }
};