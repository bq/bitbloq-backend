'use strict';

var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mark: Number,
    status: {
        type: String,
        default: 'pending' //pending | completed | missed
    },
    result: {
        type: String,
        data: {}
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: false,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        trim: false,
        required: true
    },
    initDate: {
        type: Date,
        default: Date.now()
    },
    endDate: Date
}, {
    timestamps: true
});


module.exports = mongoose.model('Task', TaskSchema);
