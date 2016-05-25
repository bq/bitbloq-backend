'use strict';

var mongoose = require('mongoose');

var ForumThreadSchema = new mongoose.Schema({

    title: {
        type: String,
        lowercase: false,
        trim: true,
        required: true
    },
    numberOfViews: {
        type: Number,
        default: 0
    },
    categoryId: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    creatorId: {
        type: String,
        trim: false,
        required: true
    }
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
