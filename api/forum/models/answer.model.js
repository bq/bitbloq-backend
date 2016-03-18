'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    content: {
        type: String,
        lowercase: false,
        trim: false
    },
    owner: {
        username: {
            type: String,
            lowercase: true,
            trim: true
        },
        _id: {
            type: String,
            lowercase: false,
            trim: false
        },
        avatar: {
            type: String,
            lowercase: true,
            trim: true
        }
    },
    themeId: {
        type: String,
        lowercase: false,
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
            themeId: this.themeId
        });
    }
};

module.exports = mongoose.model('Answer', AnswerSchema);