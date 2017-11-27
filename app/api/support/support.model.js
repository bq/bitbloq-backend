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

/**
 * Virtuals
 */

// Public support information
SupportSchema.virtual('support').get(function() {
    return {
        _id: this._id,
        permalink: this.permalink,
        title: this.title,
        data: this.data,
        extData: this.extData,
        dontShowHomeButton: this.dontShowHomeButton,
        next: this.next
    };
});

module.exports = mongoose.model('Support', SupportSchema);
