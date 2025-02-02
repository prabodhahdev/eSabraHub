const mongoose = require('mongoose');

const serviceExtraPhotosSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    extraPhotos: [String], 
}, {
    timestamps: true
});

module.exports = mongoose.model('ServiceExtraPhotos', serviceExtraPhotosSchema);
