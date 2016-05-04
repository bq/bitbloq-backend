'use strict';

var mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    content: {type: String, lowercase: false, trim: false},
    owner: {
        username: {type: String, lowercase: true, trim: true},
        _id: {type: String, lowercase: false, trim: false},
        avatar: {type: String, lowercase: true, trim: true}
    },
    threadId: {type: String, lowercase: false, trim: false},
    categoryId: {type: String, lowercase: false, trim: false},
    main: {type: Boolean, default: false},
    images: [],
    _createdAt: {type: Date, default: Date.now}
}, {
    timestamps: true
});

/**
 * Validations
 */

// Validate empty answer
AnswerSchema
    .path('content')
    .validate(function(content) {
        return content.length;
    }, 'Answer content cannot be empty');

/**
 * Methods
 */
AnswerSchema.methods = {
    removeAnswersInThread: function(next) {
        return this.model('Answer').remove({
            threadId: this.threadId
        }, next)
    },
    countAnswersInThread: function(next) {
        return this.model('Answer').count({
            threadId: this.threadId
        }, next);
    },
    getLastAnswerInThread: function(next) {
        return this.model('Answer').findOne({
            threadId: this.threadId
        }).sort({
            updatedAt: 'asc'
        }).limit(1).exec(next);
    }
};

module.exports = mongoose.model('Answer', AnswerSchema);
