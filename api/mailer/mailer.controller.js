'use strict';

var utils = require('../utils'),
    mailer = require('../../components/mailer');

/**
 * Send an email
 */
exports.sendEmail = function(req, res) {
    var locals = {
        email: req.body.email,
        subject: req.body.subject,
        name: 'Peter parker',
        resetUrl: 'http://holakease.com'
    };
    mailer.sendOne('password_reset', locals, function(err) {
        if (err) {
            console.log('ERROR: ', err);
            utils.handleError(res);
        }
        res.sendStatus(200);
    });
};