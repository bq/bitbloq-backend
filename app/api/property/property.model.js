'use strict';

var mongoose = require('mongoose');

var PropertySchema = new mongoose.Schema({
    web2boardVersion : String,
    bitbloqLibsVersion : String,
    bloqsSortTree : {},
    _createdAt: { 
        type: Date, 
        default: Date.now 
    },
    _updatedAt : Date
});


module.exports = mongoose.model('Property', PropertySchema);
