'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ThreadSchema = new Schema({

    title: {
        type: String,
        lowercase: false,
        trim: true
    },
    lastAnswer: {},
    numberOfAnswers: {
        type: Number,
        default: 0
    },
    numberOfViews: {
        type: Number,
        default: 0
    },
    categoryId: {
        type: String,
        lowercase: true,
        trim: true
    },
    creator: {
        _id: String,
        name: String,
    }
}, {
    timestamps: true
});

/**
 * Validations
 */

// Validate empty title
ThreadSchema
    .path('title')
    .validate(function(title) {
        return title.length;
    }, 'Thread title cannot be empty');

// Validate empty name section
ThreadSchema
    .path('categoryId')
    .validate(function(categoryId) {
        return categoryId.length;
    }, 'Thread categoryId cannot be empty');

/**
 * Pre-save hook
 */
ThreadSchema
    .pre('save', function(next) {
        next();
    });

/**
 * Methods
 */
ThreadSchema.methods = {
    getThread: function() {
        return this.model('Thread').findOne({
            _id: this._id
        });
    },

    getThreadsInCategory: function() {
        return this.model('Thread').find({
            categoryId: this.categoryId
        });
    },

    getThreadsInCategoryByID: function() {
        return this.model('Thread').find({
            categoryId: this.categoryId
        });
    },

    getLastThreadInCategory: function() {
        return this.model('Thread').findOne({
            categoryId: this.categoryId
        }).sort({
            updatedAt: 'asc'
        }).limit(1);
    },

    countThreadsInCategory: function() {
        return this.model('Thread').count({
            categoryId: this.categoryId
        });
    }
};

module.exports = mongoose.model('Thread', ThreadSchema);