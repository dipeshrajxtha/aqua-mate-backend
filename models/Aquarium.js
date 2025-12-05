const mongoose = require('mongoose');

const AquariumSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Flutter fields (exact names)
    name: {
        type: String,
        required: true,
        trim: true,
    },
    aquariumType: {
        type: String,
        enum: ['FRESHWATER', 'SALTWATER'],
        required: true,
    },
    tankSize: {
        type: Number,
        required: true,
        min: 1,
    },
    tankShape: {
        type: String,
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Aquarium', AquariumSchema);
