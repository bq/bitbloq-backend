'use strict';

var mongoose = require('mongoose');

var ForumCategorySchema = new mongoose.Schema({
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
    },
    _createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

/**
 * Validations
 */

// Validate unique name
ForumCategorySchema
    .path('name')
    .validate(function(name, next) {
        this.constructor.findOne({
            name: name
        }, function(err, forumcategory) {
            if (err) {
                next(err);
            } else if (forumcategory) {
                next(409);
            } else {
                next();
            }
        });
    }, 'ForumCategory name already in use');

module.exports = mongoose.model('ForumCategory', ForumCategorySchema);