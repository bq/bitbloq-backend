'use strict';

var mongoose = require('mongoose');

var ChangelogSchema = new mongoose.Schema({
    version: {},
    content: {},
    order: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Changelog', ChangelogSchema);