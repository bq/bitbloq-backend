'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var FeedbackSchema = new mongoose.Schema({
    message : String,
    os: String,
    browser: String,
    userAgent: String,
    userInfo: {},
    _createdAt: { type: Date, default: Date.now },
    _updatedAt : Date
});


module.exports = mongoose.model('Feedback', FeedbackSchema);
