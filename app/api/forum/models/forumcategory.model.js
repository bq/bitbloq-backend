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
    },
    deleted: Boolean
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
                next({
                    code: 409,
                    message: 'Conflict'
                });
            } else {
                next();
            }
        });
    }, 'ForumCategory name already in use');


/**
 * Pre hook
 */

function findNotDeletedMiddleware(next) {
    this.where('deleted').in([false, undefined, null]);
    next();
}

ForumCategorySchema.pre('find', findNotDeletedMiddleware);
ForumCategorySchema.pre('findOne', findNotDeletedMiddleware);
ForumCategorySchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
ForumCategorySchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

ForumCategorySchema.methods = {

    /**
     * delete - change deleted attribute to true
     *
     * @param {Function} next
     * @api public
     */
    delete: function(next) {
        this.deleted = true;
        this.save(next);
    }
};

module.exports = mongoose.model('ForumCategory', ForumCategorySchema);
