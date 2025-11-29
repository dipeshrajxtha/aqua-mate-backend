const Reminder = require('../models/Reminder'); 

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res) => {
    const userId = req.user.id; 

    // FIX: Using single dueDateTime field to match Flutter model
    const { tankName, reminderType, dueDateTime } = req.body; 

    if (!tankName || !reminderType || !dueDateTime) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide all required fields: tank name, type, and scheduled date/time.' 
        });
    }

    try {
        // The Flutter client sends a single ISO string for dueDateTime
        const newReminder = await Reminder.create({
            user: userId, 
            tankName,
            reminderType,
            dueDateTime: new Date(dueDateTime), // Mongoose automatically converts ISO string to Date
        });

        res.status(201).json({
            success: true,
            data: newReminder,
            message: 'Maintenance form saved successfully!'
        });

    } catch (error) {
        console.error('Mongoose Reminder Creation Error:', error.message);
        
        let message = 'Failed to save reminder due to server error.';
        if (error.name === 'ValidationError') {
            message = Object.values(error.errors).map(val => val.message).join(', ');
        }
        
        res.status(400).json({ 
            success: false, 
            message: message 
        });
    }
};


// @desc    Get all reminders for the authenticated user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
    try {
        // FIX: Sorting by new field name
        const reminders = await Reminder.find({ user: req.user.id }).sort({ dueDateTime: 1 });

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