'use strict';

var mongoose = require('mongoose');

var VersionSchema = new mongoose.Schema({
    backEnd : String,
    frontEnd: String
}, {
    timestamps: true
});


module.exports = mongoose.model('Version', VersionSchema);
