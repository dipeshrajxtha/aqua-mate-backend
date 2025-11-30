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
        select: false 
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        default: 'Male'
    },
    dob: {
        type: Date,
        required: [true, 'Please add your date of birth'] 
    },
    profilePicture: {
        type: String,
        default: 'https://i.imgur.com/G5g2mJc.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// ---------------------------------------------------------
// 🔒 PASSWORD HASHING MIDDLEWARE (SAFE + CORRECT)
// ---------------------------------------------------------
// IMPORTANT: Do NOT use (next). Async pre-hooks must NOT call next().
UserSchema.pre('save', async function () {
    // Only hash password if modified or new
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// ---------------------------------------------------------
// 🔐 COMPARE PASSWORD METHOD
// ---------------------------------------------------------
UserSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
