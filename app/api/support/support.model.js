'use strict';
var mongoose = require('mongoose');

var SupportSchema = new mongoose.Schema({
    permalink: {
        type: String,
        unique: true
    },
    title: { type: String, default: '' },
    data:  { 
      ext: { type: Boolean, default: false },
      body: { type: String, default: '' },
      scope: {}
    },
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
