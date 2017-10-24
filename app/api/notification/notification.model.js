'use strict';

var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema(
    {
        type: String, //GLOBAL - GROUP - PERSONAL
        order: Number,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            trim: false,
            required: true
        },
        usersId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
        ],
        data: {},
        startDate: { type: Date },
        endDate: { type: Date }
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Notification', NotificationSchema);