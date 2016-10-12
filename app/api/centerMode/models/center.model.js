'use strict';

var mongoose = require('mongoose');

var CenterSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    location: {
        type: String
    },
    telephone: {
        type: Number,
        trim: true,
        required: true
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: false,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Center', CenterSchema);
