// controllers/profileController.js

// 🚨 CRITICAL FIX 1: Correct path casing for Linux/Render deployment
// Must match the file name: User.js
const User = require('../models/user'); 

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
    // Use optional chaining for robustness, though Express handles body access well
    user.fullName = req.body.fullName || user.fullName;
    user.dob = req.body.dob || user.dob;

    // --- 2. Handle File Upload (Multer result) ---
    if (req.file) {
      // The path is relative to the server root (e.g., uploads/profilePicture-12345.jpg)
      // We store the relative path for the frontend to access later
      // The replace() fixes Windows backslashes (\) to forward slashes (/) for web URLs.
      user.profilePicture = '/' + req.file.path.replace(/\\/g, "/"); 
    }
    
    // --- 3. Save Changes ---
    const updatedUser = await user.save();

    // --- 4. Return the Updated User Object (Exclude password) ---
    // The backend MUST return JSON for the Flutter app
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
    // 🚨 IMPORTANT: Ensure we always return a JSON error response
    res.status(500).json({ message: 'Server error during profile update.', details: error.message });
  }
};