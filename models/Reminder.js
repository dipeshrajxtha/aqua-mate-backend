// models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    // Link the reminder to the user who created it (essential)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assumes your User model is named 'User'
        required: true,
    },
    tankName: {
        type: String,
        required: [true, 'Please provide a tank name for the reminder'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['fishFeed', 'waterChange', 'tankCleaning', 'filterWash'],
        required: [true, 'Please select a reminder type'],
    },
    dueDateTime: {
        type: Date,
        required: [true, 'Please provide a scheduled date and time'],
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'missed'],
        default: 'upcoming',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Reminder', reminderSchema);