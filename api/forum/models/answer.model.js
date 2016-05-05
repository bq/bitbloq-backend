'use strict';

var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    content: {type: String, lowercase: false, trim: false, required: true},
    owner: {
        username: {type: String, lowercase: true, trim: true},
        _id: {type: String, lowercase: false, trim: false},
        avatar: {type: String, lowercase: true, trim: true}
    },
    threadId: {type: String, lowercase: false, trim: false, required: true},
    categoryId: {type: String, lowercase: false, trim: false},
    main: {type: Boolean, default: false},
    images: [],
    _createdAt: {type: Date, default: Date.now}
}, {
    timestamps: true
});

module.exports = mongoose.model('Answer', AnswerSchema);
