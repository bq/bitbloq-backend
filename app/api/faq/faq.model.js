'use strict';

var mongoose = require('mongoose');

var FaqSchema = new mongoose.Schema({
    title: {},
    content: {},
    order: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Faq', FaqSchema);