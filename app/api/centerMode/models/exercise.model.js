'use strict';

var mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: false,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: false,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
