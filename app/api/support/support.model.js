'use strict';
var mongoose = require('mongoose');

var SupportSchema = new mongoose.Schema({
    permalink: {
        type: String,
        unique: true
    },
    title: String,
    data: String,
    extData: String,
    dontShowHomeButton: Boolean,
    next: [
        {
            permalink: {
                type: String,
                required: true
            },
            class: {
                type: String,
                enum: ['green', 'red', 'black'],
                deault: 'black'
            },
            icon: String,
            response: String
        }
    ]
});

module.exports = mongoose.model('Support', SupportSchema);
