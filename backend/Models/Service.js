const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    coordinates: {
        lat: {
            type: Number, 
        },
        lng: {
            type: Number, 
        },
    },
    description: {
        type: String,
        required: true,
    },
    mainPhoto: {
        type: String,  
    },
   
    serviceType: {
        type: String,
        enum: ['accommodation', 'food', 'medical', 'transport', 'attractiveplaces'],
        required: true,
    },
    extraPhotos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceExtraPhotos', // Reference to the ServiceExtraPhotos model
    },
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
