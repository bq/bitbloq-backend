'use strict';

var mongoose = require('mongoose');

var ForumCategorySchema = new mongoose.Schema({
    _id: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    section: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
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
                next({code:409, message:'Conflict'});
            } else {
                next();
            }
        });
    }, 'ForumCategory name already in use');

module.exports = mongoose.model('ForumCategory', ForumCategorySchema);
