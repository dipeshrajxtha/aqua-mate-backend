// controllers/reminderController.js

const Reminder = require('../models/Reminder'); 
// Assuming the Reminder model is imported like this

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private (uses protect middleware)
const createReminder = async (req, res) => {
    // The 'protect' middleware adds req.user.id to the request
    const userId = req.user.id; 

    // Destructure data from the request body (sent by Flutter form)
    const { tankName, reminderType, reminderDate, reminderTime } = req.body;

    // --- Basic Input Validation (Optional but Recommended) ---
    if (!tankName || !reminderType || !reminderDate || !reminderTime) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide all required fields: tank name, type, date, and time.' 
        });
    }

    try {
        // 🚨 CRITICAL FIX: Use await to ensure Mongoose completes the operation.
        const newReminder = await Reminder.create({
            user: userId, // Link the reminder to the authenticated user
            tankName,
            reminderType,
            reminderDate,
            reminderTime
        });

        // If the save is successful, send the response
        res.status(201).json({
            success: true,
            data: newReminder,
            message: 'Maintenance form saved successfully!'
        });

    } catch (error) {
        // 🚨 CRITICAL FIX: Catch any Mongoose validation or database errors.
        console.error('Mongoose Reminder Creation Error:', error.message);
        
        // Handle specific validation errors (e.g., required fields missing)
        let message = 'Failed to save reminder due to server error.';
        if (error.name === 'ValidationError') {
            message = Object.values(error.errors).map(val => val.message).join(', ');
        }
        
        // Send a 500 or 400 error response back to Flutter
        res.status(400).json({ 
            success: false, 
            message: message 
        });
    }
};


// @desc    Get all reminders for the authenticated user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
    try {
        // Fetch reminders only for the logged-in user (req.user.id provided by 'protect' middleware)
        const reminders = await Reminder.find({ user: req.user.id }).sort({ reminderDate: 1 });

        res.status(200).json({
            success: true,
            data: reminders
        });
    } catch (error) {
        console.error('Mongoose Get Reminders Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch reminders.' 
        });
    }
};


module.exports = {
    createReminder,
    getReminders,
};