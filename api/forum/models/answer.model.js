'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    content: { type: String, lowercase: false, trim: false },
    owner: {
        username: { type: String, lowercase: true, trim: true },
        _id: { type: String, lowercase: false, trim: false },
        avatar: { type: String, lowercase: true, trim: true }
    },
    threadId: { type: String, lowercase: false, trim: false },
    main: { type: Boolean, default: false },
    images: [],
    _createdAt: { type: Date, default: Date.now }
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
 * Pre-save hook
 */
AnswerSchema
    .pre('save', function(next) {
        next();
    });

/**
 * Methods
 */
AnswerSchema.methods = {
    getAnswersInThread: function() {
        return this.model('Answer').find({
            threadId: this.threadId
        });
    },
    removeAnswersInThread: function() {
        return this.model('Answer').remove({
            threadId: this.threadId
        })
    },
    countAnswersInThread: function() {
        return this.model('Answer').count({
            threadId: this.threadId
        });
    },
    getLastAnswerInThread: function() {
        return this.model('Answer').findOne({
            threadId: this.threadId
        }).sort({
            updatedAt: 'asc'
        }).limit(1);
    },
};

module.exports = mongoose.model('Answer', AnswerSchema);
