'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {
        type: String,
        lowercase: false,
        trim: true,
        required: true
    },
    uuid: {
        type: String,
        lowercase: true,
        trim: true
    },
    section: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
        lowercase: false,
        trim: false
    },
    order: {
        type: Number,
        min: 0,
        max: 1000
    }
}, {
    timestamps: true
});

/**
 * Validations
 */

// Validate empty name category
CategorySchema
    .path('name')
    .validate(function(name) {
        return name.length;
    }, 'Category name cannot be empty');

// Validate empty name section
CategorySchema
    .path('section')
    .validate(function(section) {
        return section.length;
    }, 'Category section cannot be empty');

/**
 * Pre-save hook
 */
CategorySchema
    .pre('save', function(next) {
        next();
    });

/**
 * Methods
 */
CategorySchema.methods = {};

module.exports = mongoose.model('Category', CategorySchema);