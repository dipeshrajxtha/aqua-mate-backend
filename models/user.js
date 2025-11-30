// models/user.js - Defines the MongoDB User Schema and logic

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a full name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Prevents the password from being returned in standard queries
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        default: 'Male'
    },
    dob: {
        type: Date,
        // Added required constraint based on Flutter validation
        required: [true, 'Please add your date of birth'] 
    },
    profilePicture: {
        type: String,
        default: 'https://i.imgur.com/G5g2mJc.png' // Default image placeholder
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Middleware: Encrypt Password using bcrypt before saving ---
UserSchema.pre('save', async function (next) {
    // Only run this function if the password was actually modified
    if (!this.isModified('password')) {
        return next();
    }
    
    // 🔥 FIX: Wrap asynchronous operations in try...catch to prevent unhandled errors
    // from crashing Mongoose's middleware chain.
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Proceed to save after successful hashing
    } catch (err) {
        // CRITICAL: Pass the error to the next Mongoose handler.
        // This is the safest way to fail a 'save' operation.
        next(err); 
    }
});

// --- Method to compare submitted password with hashed password ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // Ensure 'this.password' exists before comparison
    if (!this.password) return false;
    
    // bcrypt.compare handles the hashing difference check
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);