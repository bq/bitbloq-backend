'use strict';

var mongoose = require('mongoose');

var FeedbackSchema = new mongoose.Schema({
    message: String,
    os: String,
    browser: String,
    userAgent: String,
    userInfo: {},
    _createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Feedback', FeedbackSchema);
