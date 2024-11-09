const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    originalname: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the File model
const File = mongoose.model('File', fileSchema);

module.exports = File;
