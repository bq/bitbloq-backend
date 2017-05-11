'use strict';

var mongoose = require('mongoose');

var RobotSchema = new mongoose.Schema({
    uuid: {
        type: String,
        unique: true
    },
    board: String,
    manufacturer: String,
    family: String,
    width: Number,
    height: Number,
    thirdParty: Boolean,
    useBoardImage: Boolean,
    underDevelopment: Boolean,
    includedComponents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hardware-component'
    }],
    order: Number,
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

RobotSchema.pre('find', findNotDeletedMiddleware);
RobotSchema.pre('findOne', findNotDeletedMiddleware);
RobotSchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
RobotSchema.pre('count', findNotDeletedMiddleware);

/**
 * Methods
 */

RobotSchema.methods = {

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

module.exports = mongoose.model('hardware-robot', RobotSchema);
