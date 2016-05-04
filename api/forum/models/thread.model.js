'use strict';

var mongoose = require('mongoose');

var ThreadSchema = new mongoose.Schema({

    title: {type: String, lowercase: false, trim: true},
    lastAnswer: {},
    numberOfViews: {type: Number, default: 0},
    categoryId: {type: String, lowercase: true, trim: true},
    creator: {_id: String, name: String},
    _createdAt: {type: Date, default: Date.now},
    _updatedAt: { type: Date, default: Date.now }
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
 * Methods
 */
ThreadSchema.methods = {

    getThreadsInCategory: function(next) {
        this.model('Thread').find({
            categoryId: this.categoryId
        }, next);
    },

    getThreadsInCategoryByID: function(next) {
        this.model('Thread').find({
            categoryId: this.categoryId
        }, next);
    },

    getLastThreadInCategory: function(next) {
        this.model('Thread').findOne({
            categoryId: this.categoryId
        }).sort({
            updatedAt: 'asc'
        }).limit(1)
            .exec(next);
    },

    countThreadsInCategory: function(next) {
        this.model('Thread').count({
            categoryId: this.categoryId
        }, next);
    }
};

module.exports = mongoose.model('Thread', ThreadSchema);
