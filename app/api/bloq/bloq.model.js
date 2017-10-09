'use strict';

var mongoose = require('mongoose');

var BloqSchema = new mongoose.Schema({
    type: String,
    name: String,
    connectors: Array,
    bloqClass: String,
    content: Array,
    code: String,
    returnType: {},
    headerText: String,
    descriptionText: String,
    createDynamicContent: {},
    suggestedBloqs: [],
    arduino: {},
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

BloqSchema.pre('find', findNotDeletedMiddleware);
BloqSchema.pre('findOne', findNotDeletedMiddleware);
BloqSchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
BloqSchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

BloqSchema.methods = {

    /**
     * delete - change deleted attribute to true
     *
     * @param {Function} next
     * @api public
     */
    delete: function (next) {
        this.deleted = true;
        this.save(next);
    }
};


module.exports = mongoose.model('Bloq', BloqSchema);