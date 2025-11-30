// models/Aquarium.js
const mongoose = require('mongoose');

const AquariumSchema = new mongoose.Schema({
    // Links the tank to the authenticated user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Form data fields
    tankName: {
        type: String,
        required: [true, 'Please name your aquarium'],
        trim: true,
    },
    capacityLiters: {
        type: Number,
        required: [true, 'Capacity (Liters) is required'],
        min: [1, 'Capacity must be greater than 0'],
    },
    filterType: {
        type: String,
        enum: ['Hang-on-Back (HOB)', 'Canister', 'Internal', 'Sponge'],
        required: true,
    },
    heaterNeeded: {
        type: String,
        enum: ['Yes', 'No'],
        required: true,
    },
    substrateType: {
        type: String,
        enum: ['Gravel', 'Sand', 'Soil (for planted tanks)', 'Bare Bottom'],
        required: true,
    },
    isPlanted: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
}, { 
    // Mongoose option to include createdAt and updatedAt timestamps
    timestamps: true 
});

module.exports = mongoose.model('Aquarium', AquariumSchema);