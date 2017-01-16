'use strict';

var mailer = require('../../components/mailer'),
    config = require('../../res/config.js');

/**
 * Create a new feedback
 */
exports.send = function(req, res) {
    var locals = {
        email: config.supportEmail,
        emailTObbc: config.emailTObbc,
        subject: 'Nuevo feedback',
        user: req.body.creator,
        feedback: req.body
    };

    mailer.sendOne('newFeedback', locals, function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).send();
        }
    });
};
