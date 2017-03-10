'use strict';

var mongoose = require('mongoose');

var FaqSchema = new mongoose.Schema({
    title: {},
    content: {},
    order: {
        type: Number,
        default: 0
    },
    deleted: Boolean
});

/**
 * Pre hook
 */

function findNotDeletedMiddleware(next) {
    this.where('deleted').in([false, undefined, null]);
    next();
}

FaqSchema.pre('find', findNotDeletedMiddleware);
FaqSchema.pre('findOne', findNotDeletedMiddleware);
FaqSchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
FaqSchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

FaqSchema.methods = {

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

module.exports = mongoose.model('Faq', FaqSchema);