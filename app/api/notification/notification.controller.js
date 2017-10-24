'use strict';

var Notification = require('./notification.model.js'),
    NotificationStatus = require('./notificationstatus.model.js'),
    utils = require('../utils'),
    async = require('async');



exports.getNotifications = function (req, res) {

    /*Notification.find()
        .or([
            { type: 'GLOBAL' },
            { userId: req.user._id },
            { usersId: req.user._id }
        ])
        .and([{ startDate: { $lte: Date.now() } }, { endDate: { $gte: Date.now() } }])
        .limit(15)
        .sort({
            order: 'desc'
        })
        .exec(function (err, notifications) {
            if (err) {
                console.log(err);
                err.code = utils.getValidHttpErrorCode(err);
                res.status(err.code).send(err);
            } else {
                res.status(200).json(notifications);
            }
        });*/
    res.status(200).json({});
};

exports.create = function (req, res) {


    res.status(200).json({});
};