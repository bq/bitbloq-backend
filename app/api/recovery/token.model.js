'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TokenSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    token: String,
    createdAt: {
        type: Date,
        expires: 7200,
        default: Date.now
    }
});


/**
 * Pre-save hook
 */

TokenSchema.pre('save', function(next) {
    this._id = this.userId;
    this.userId = undefined;
    next();
});


module.exports = mongoose.model('Token', TokenSchema);
