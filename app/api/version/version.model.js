'use strict';

var mongoose = require('mongoose');

var VersionSchema = new mongoose.Schema({
    backend : String,
    frontend: String,
    compiler: String,
    centermode: String
}, {
    timestamps: true
});


module.exports = mongoose.model('Version', VersionSchema);
