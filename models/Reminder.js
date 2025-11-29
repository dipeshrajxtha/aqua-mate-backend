// models/Reminder.js

const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    // CRITICAL: Link the reminder to a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Must match the name of your User model
        required: true // Ensures only authenticated users can create reminders
    },
    tankName: {
        type: String,
        required: [true, 'Tank name is required'],
        trim: true
    },
    reminderType: {
        type: String,
        required: [true, 'Reminder type is required']
        // You might add an enum here: enum: ['Fish Feed', 'Water Change', 'Tank Cleaning', 'Filter Wash']
    },
    reminderDate: {
        type: Date, // Store as a proper Date object
        required: [true, 'Reminder date is required']
    },
    reminderTime: {
        type: String, // Store time as a string (HH:mm format) or adjust to Date
        required: [true, 'Reminder time is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // This setting ensures Mongoose adds the 'updatedAt' field automatically
    timestamps: true 
});

module.exports = mongoose.model('Reminder', reminderSchema);