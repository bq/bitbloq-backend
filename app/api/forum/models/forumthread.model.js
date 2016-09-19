'use strict';

var mongoose = require('mongoose');

var ForumThreadSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: true
    },
    numberOfViews: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        ref: 'ForumCategory',
        trim: false,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: false,
        required: true
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }]

}, {
    timestamps: true
});

/**
 * Methods
 */

ForumThreadSchema.methods = {

    /**
     * addView - add a visit to Forumthread
     *
     * @api public
     */
    addView: function() {
        if (this.numberOfViews) {
            this.numberOfViews++;
        } else {
            this.numberOfViews = 1;
        }
    }
};

module.exports = mongoose.model('ForumThread', ForumThreadSchema);
