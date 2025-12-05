// models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tankName: {
        type: String,
        required: [true, 'Tank name is required'],
        trim: true
    },
    dueDateTime: { 
        type: Date,
        required: [true, 'Scheduled date and time is required']
    },
    type: {
        type: String,
        required: [true, 'Reminder type is required'],
        enum: ['fishFeed', 'waterChange', 'tankCleaning', 'filterWash'],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reminder', reminderSchema);
