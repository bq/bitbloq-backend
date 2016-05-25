'use strict';

var mongoose = require('mongoose');

var ForumAnswerSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: false,
        required: true
    },
    creatorId: {
        type: String,
        trim: false
    },
    threadId: {
        type: String,
        trim: false,
        required: true
    },
    categoryId: {
        type: String,
        trim: false
    },
    main: {
        type: Boolean,
        default: false
    },
    images: []
}, {
    timestamps: true
});

module.exports = mongoose.model('ForumAnswer', ForumAnswerSchema);
