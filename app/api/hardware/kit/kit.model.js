'use strict';

var mongoose = require('mongoose');

var KitSchema = new mongoose.Schema({
    _id: {
        type: String,
        trim: true,
        required: true
    },
    board: Array,
    components: Array,
    purchaseUrl: String,
    manufacturer: String,
    underDevelopment: Boolean,
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

KitSchema.pre('find', findNotDeletedMiddleware);
KitSchema.pre('findOne', findNotDeletedMiddleware);
KitSchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
KitSchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

KitSchema.methods = {

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

module.exports = mongoose.model('hardware-kit', KitSchema);