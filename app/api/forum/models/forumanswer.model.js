'use strict';

var mongoose = require('mongoose'),
    ImageFunctions = require('../../image/image.functions.js');

var ForumAnswerSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: false,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: false,
        required: true
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumThread',
        trim: false,
        required: true
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
        if (this.creator.toString() === userId.toString()) {
            owner = true;
        }
        return owner;
    }
};


module.exports = mongoose.model('ForumAnswer', ForumAnswerSchema);
