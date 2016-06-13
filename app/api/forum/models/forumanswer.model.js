'use strict';

var mongoose = require('mongoose'),
    ImageFunctions = require('../../image/image.functions.js');

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
        type: mongoose.Schema.Types.ObjectId,
        ref: "forumthread",
        trim: false,
        required: true
    },
    categoryId: {
        type: String,
        ref: "forumcategory",
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
 * Pre-save hook
 */
ForumAnswerSchema
    .pre('remove', function(next) {
        if (this.images && this.images.length > 0) {
            ImageFunctions.delete('forum', this._id);
        }
        next();
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
