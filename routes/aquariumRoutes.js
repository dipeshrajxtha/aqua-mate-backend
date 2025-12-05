const express = require('express');
const router = express.Router();
const Aquarium = require('../models/Aquarium');
const { protect } = require('../middleware/authMiddleware');

// CREATE aquarium (Flutter POST)
router.post('/', protect, async (req, res) => {
    try {
        const {
            name,
            aquariumType,
            tankSize,
            tankShape,
            temperature,
            location,
            description
        } = req.body;

        // Validate required fields
        if (!name || !aquariumType || !tankSize || !tankShape || !temperature || !location) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        const newAquarium = new Aquarium({
            user: req.user.id,
            name,
            aquariumType,
            tankSize,
            tankShape,
            temperature,
            location,
            description: description ?? "",
        });

        const saved = await newAquarium.save();

        res.status(201).json(saved);

    } catch (err) {
        console.error('Aquarium POST Error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// GET all aquariums for the user
router.get('/', protect, async (req, res) => {
    try {
        const aquariums = await Aquarium.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(aquariums);
    } catch (err) {
        console.error('GET Error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
