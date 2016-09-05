'use strict';

var mongoose = require('mongoose');

var AutorizationTokenSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    token: String,
    createdAt: {
        type: Date,
        expires: 1296000000,
        default: Date.now
    }
});


/**
 * Pre-save hook
 */

AutorizationTokenSchema.pre('save', function(next) {
    this._id = this.userId;
    this.userId = undefined;
    next();
});


module.exports = mongoose.model('AutorizationToken', AutorizationTokenSchema);
