// routes/aquariumRoutes.js
const express = require('express');
const router = express.Router();
const Aquarium = require('../models/Aquarium');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/aquariums
 * @desc    Create a new aquarium setup entry from Flutter form
 * @access  Private (Requires token/ID via protect middleware)
 */
router.post('/', protect, async (req, res) => {
    try {
        // Data from Flutter request body
        const {
            name,
            capacity_liters,
            filter_type,
            heater_needed,
            substrate_type,
            is_planted,
        } = req.body;

        // Basic Server-Side Validation
        if (!name || !capacity_liters || !filter_type || !heater_needed || !substrate_type) {
            return res.status(400).json({ msg: 'Missing required aquarium setup fields.' });
        }
        
        // Mongoose Schema Creation
        const newAquarium = new Aquarium({
            user: req.user.id, // User ID attached by the 'protect' middleware
            tankName: name,
            capacityLiters: capacity_liters, // Note: Schema uses camelCase, Flutter sends snake_case
            filterType: filter_type,
            heaterNeeded: heater_needed,
            substrateType: substrate_type,
            isPlanted: is_planted,
        });

        const aquarium = await newAquarium.save();
        
        // Success response
        res.status(201).json({
            success: true,
            data: aquarium,
            message: 'Aquarium setup successfully created and saved.'
        });

    } catch (err) {
        console.error('Error saving aquarium setup:', err.message);
        // Handle Mongoose validation errors (e.g., capacity < 1, enum mismatch)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message, details: err.errors });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;