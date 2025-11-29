// controllers/profileController.js - Handles profile update logic

// NOTE: This file assumes User model path is correct relative to its location
const User = require('./models/user');
// --- Profile Update Logic ---
exports.updateProfile = async (req, res) => {
    // NOTE: In a real app, you would use req.user.id from an authentication middleware (like JWT)
    // For now, we will assume the userId is passed in the body for testing purposes.
    const { userId, fullName, dob } = req.body;
    
    // Check for user ID (replace with auth check later)
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required for update.' });
    }

    try {
        let updateFields = {};

        // 1. Handle Profile Picture Upload (handled by multer middleware)
        if (req.file) {
            // The file path where Multer saved the image
            // Assuming the server is running on http://10.0.2.2:3000
            // and files are served from /uploads
            const fileUrl = `/uploads/${req.file.filename}`;
            updateFields.profilePicture = fileUrl;
        }

        // 2. Handle Name and DOB Update
        if (fullName) {
            updateFields.fullName = fullName;
        }
        if (dob) {
            // MongoDB accepts the ISO date string directly
            updateFields.dob = dob;
        }

        // 3. Perform the update in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true } // Return the new document and run schema validation
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 4. Respond with the new user details
        res.status(200).json({
            message: 'Profile updated successfully.',
            userId: updatedUser._id,
            fullName: updatedUser.fullName,
            gender: updatedUser.gender,
            dob: updatedUser.dob,
            profilePicture: updatedUser.profilePicture,
        });

    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).json({ message: 'Server error during profile update.', error: err.message });
    }
};