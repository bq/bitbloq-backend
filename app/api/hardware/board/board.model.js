'use strict';

var mongoose = require('mongoose');

var BoardSchema = new mongoose.Schema({
    uuid: String,
    name: String,
    mcu: String,
    manufacturer: String,
    vendorIds: Array,
    productIds: Array,
    showInToolbox: Boolean,
    pinSize: {},
    pins: {},
    underDevelopment: Boolean,
    availableComponents: Array,
    integratedComponents: Array,
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

BoardSchema.pre('find', findNotDeletedMiddleware);
BoardSchema.pre('findOne', findNotDeletedMiddleware);
BoardSchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
BoardSchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

BoardSchema.methods = {

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

module.exports = mongoose.model('hardware-board', BoardSchema);