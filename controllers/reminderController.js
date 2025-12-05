// controllers/reminderController.js
const Reminder = require('../models/Reminder');
const asyncHandler = require('express-async-handler');

// ---------------------------------------------------------
// CREATE REMINDER  (Private)
// POST /api/reminders
// ---------------------------------------------------------
const createReminder = asyncHandler(async (req, res) => {
    const userId = req.user._id; // <-- FIXED: protect middleware sets req.user._id

    const { tankName, type, dueDateTime } = req.body;

    if (!tankName || !type || !dueDateTime) {
        return res.status(400).json({
            success: false,
            message: 'Please provide the tank name, type, and scheduled date/time.'
        });
    }

    const reminder = await Reminder.create({
        user: userId,
        tankName,
        type,
        dueDateTime: new Date(dueDateTime)
    });

    res.status(201).json({
        success: true,
        data: reminder
    });
});

// ---------------------------------------------------------
// GET ALL REMINDERS  (Private)
// GET /api/reminders
// ---------------------------------------------------------
const getReminders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const reminders = await Reminder.find({ user: userId })
        .sort({ dueDateTime: 1 });

    res.status(200).json({
        success: true,
        data: reminders
    });
});

// ---------------------------------------------------------
// DELETE REMINDER (Private)
// DELETE /api/reminders/:id
// ---------------------------------------------------------
const deleteReminder = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
        return res.status(404).json({
            success: false,
            message: 'Reminder not found.'
        });
    }

    if (reminder.user.toString() !== userId.toString()) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to delete this reminder.'
        });
    }

    await reminder.deleteOne();

    res.status(200).json({
        success: true,
        data: { id: req.params.id }
    });
});

module.exports = {
    createReminder,
    getReminders,
    deleteReminder,
};
