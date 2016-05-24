'use strict';

var mongoose = require('mongoose');

var VersionSchema = new mongoose.Schema({
    backEnd : String,
    frontEnd: String,
    _createdAt: { 
        type: Date, 
        default: Date.now 
    },
    _updatedAt : {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Version', VersionSchema);
