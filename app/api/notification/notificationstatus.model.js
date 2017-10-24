'use strict';

var mongoose = require('mongoose');

var NotificationStatusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            trim: false,
            required: true
        },
        notification: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
            trim: false,
            required: true
        },
        status: Number
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('NotificationStatus', NotificationStatusSchema);