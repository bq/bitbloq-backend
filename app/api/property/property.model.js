'use strict';

var mongoose = require('mongoose');

var PropertySchema = new mongoose.Schema({
    web2boardVersion : String,
    bitbloqLibsVersion : String,
    bloqsSortTree : {}
}, {
    timestamps: true
});


module.exports = mongoose.model('Property', PropertySchema);
