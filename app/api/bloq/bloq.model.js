'use strict';

var mongoose = require('mongoose');

var BloqSchema = new mongoose.Schema({
    type: String,
    name: String,
    connectors: Array,
    bloqClass: String,
    content: Array,
    code: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Bloq', BloqSchema);
