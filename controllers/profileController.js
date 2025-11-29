// controllers/profileController.js

// CRITICAL FIX: Correct path casing for Linux/Render deployment
const User = require('../models/user'); 

// Placeholder to export profile update logic
exports.updateProfile = async (req, res) => {
  // Prioritize req.user (from protect middleware) for security
  const userId = req.user ? req.user._id : req.body.userId; 

  if (!userId) {
    return res.status(401).json({ message: 'Authorization error: User ID not available for update.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // --- 1. Update Text Fields ---
    user.fullName = req.body.fullName || user.fullName;
    user.dob = req.body.dob || user.dob;

    // --- 2. Handle File Upload (Multer result) ---
    if (req.file) {
      // The replace() fixes Windows backslashes (\) to forward slashes (/) for web URLs.
      user.profilePicture = '/' + req.file.path.replace(/\\/g, "/"); 
    }
    
    // --- 3. Save Changes ---
    const updatedUser = await user.save();

    // --- 4. Return the Updated User Object ---
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
    
    // FINAL LOGIC FIX: Check for Mongoose Validation Errors (The likely cause of the 500 crash)
    if (error.name === 'ValidationError') {
      // Catches errors like bad Date format for 'dob' or required fields missing
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
          message: 'Validation failed.', 
          details: messages.join(', ') 
      });
    }

    if (error.code && error.code === 11000) {
      // Catches MongoDB duplicate key error (for unique fields)
      return res.status(400).json({ message: 'Duplicate field value entered.' });
    }

    // Default 500 server error for all other unexpected crashes
    return res.status(500).json({ 
        message: 'Server error during profile update.', 
        details: error.message 
    });
  }
};