'use strict';

var mongoose = require('mongoose');

var ForumAnswerSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: false,
        required: true
    },
    creatorId: {
        type: String,
        trim: false
    },
    threadId: {
        type: String,
        trim: false,
        required: true
    },
    categoryId: {
        type: String,
        trim: false
    },
    main: {
        type: Boolean,
        default: false
    },
    images: []
}, {
    timestamps: true
});




/**
 * Methods
 */

ForumAnswerSchema.methods = {

    /**
     * isOnwer - user is answer onwer
     *
     * @param {String} userId
     * @return {Boolean}
     * @api public
     */
    isOwner: function(userId) {

        var owner = false;
        if (this.creatorId.toString() === userId.toString()) {
            owner = true;
        }
        return owner;
    }
};


module.exports = mongoose.model('ForumAnswer', ForumAnswerSchema);
