'use strict';

var mongoose = require('mongoose');

var ChangelogSchema = new mongoose.Schema({
    version: {},
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

ChangelogSchema.pre('find', findNotDeletedMiddleware);
ChangelogSchema.pre('findOne', findNotDeletedMiddleware);
ChangelogSchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
ChangelogSchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

ChangelogSchema.methods = {

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

module.exports = mongoose.model('Changelog', ChangelogSchema);