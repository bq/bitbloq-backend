'use strict';

var Feedback = require('./feedback.model.js'),
    mailer = require('../../components/mailer'),
    config = require('../../res/config.js');

/**
 * Create a new feedback
 */
exports.create = function(req, res) {
    var newFeedback = new Feedback(req.body);
    newFeedback.save(function(err, feedback) {
        if (err) {
            res.status(500).send(err);
        } else {
            var locals = {
                email: config.supportEmail,
                subject: 'Nuevo feedback',
                user: newFeedback.userInfo,
                feedback: newFeedback
            };

            mailer.sendOne('newFeedback', locals, function(err) {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send();
            });
        }
    });
};
