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
    images: [],
    deleted: Boolean
}, {
    timestamps: true
});


/**
 * Pre hook
 */

function findNotDeletedMiddleware(next) {
    this.where('deleted').in([false, undefined, null]);
    next();
}

ForumAnswerSchema.pre('find', findNotDeletedMiddleware);
ForumAnswerSchema.pre('findOne', findNotDeletedMiddleware);
ForumAnswerSchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
ForumAnswerSchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

ForumAnswerSchema.methods = {

    /**
     * delete - change deleted attribute to true
     *
     * @param {Function} next
     * @api public
     */
    delete: function(next) {
        this.deleted = true;
        this.save(next);
    },

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
