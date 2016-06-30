'use strict';
var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    config = require('../../res/config.js'),
    emailTemplates = require('email-templates'),
    path = require('path'),
    templatesDir = path.resolve('app/components/mailer/');

var defaultTransport,
    EmailAddressRequiredError = new Error('email address required');

function init() {
    switch (process.env.NODE_ENV) {
        case 'local':
        case 'development':
            defaultTransport = nodemailer.createTransport('smtps://' + config.mailer.auth.user + '%40gmail.com:' + config.mailer.auth.pass + '@smtp.gmail.com');
            break;
        case 'production':
            defaultTransport = nodemailer.createTransport(smtpTransport({
                host: 'localhost',
                port: 25,
                ignoreTLS: true
            }));
            break;
    }
}

exports.sendMail = function(to, from, subject, html, callback) {
    init();
    defaultTransport.sendMail({
            to: to,
            from: config.mailer.defaultFromAddress,
            subject: subject,
            html: html
        },
        callback
    );
};

exports.sendOne = function(templateName, locals, fn) {
    init();
    // make sure that we have an user email
    if (!locals.email) {
        return fn(EmailAddressRequiredError);
    }
    // make sure that we have a message
    if (!locals.subject) {
        return fn(EmailAddressRequiredError);
    }
    emailTemplates(templatesDir, function(err, template) {
        if (err) {
            return fn(err);
        }
        // Send a single email
        template(templateName, locals, function(err, html, text) {
            if (err) {
                return fn(err);
            }

            defaultTransport.sendMail({
                from: config.mailer.defaultFromAddress,
                to: locals.email,
                bcc: locals.emailTObbc || '',
                subject: locals.subject,
                html: html,
                generateTextFromHTML: true,
                text: text
            }, function(err, responseStatus) {
                if (err) {
                    return fn(err);
                }
                return fn(null, responseStatus.message, html, text);
            });
        });
    });
};
