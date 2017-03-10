'use strict';

var mongoose = require('mongoose');

var PropertySchema = new mongoose.Schema({
    web2boardVersion: String,
    bitbloqLibsVersion: String,
    robotsFirmwareVersion: {},
    boardsFirmwareVersion: {},
    bloqsSortTree: {},
    deleted: Boolean
}, {
    timestamps: true
});


/**
 * Pre hook
 */

function findNotDeletedMiddleware(next) {
    this.where('deleted').in([false, undefined, null]);
    next();
}

PropertySchema.pre('find', findNotDeletedMiddleware);
PropertySchema.pre('findOne', findNotDeletedMiddleware);
PropertySchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
PropertySchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

PropertySchema.methods = {

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

module.exports = mongoose.model('Property', PropertySchema);