'use strict';

var Feedback = require('./feedback.model'),
    mailer = require('../../components/mailer');


/**
 * Create a new feedback
 */
exports.create = function(req, res) {
    console.log('CREANDO QUEJA');
    var newProject = new Feedback(req.body);
    newProject.save(function(err, feedback) {
        if (err) {
            res.status(500).send(err);
        } else {
            var email = 'laura.delrio@bq.com'; //todo poner aqui a soporte
            var locals = {
                email: email,
                subject: 'Nuevo feedback'
            };

            //todo cambiar plantilla
            mailer.sendOne('password_reset', locals);
            res.sendStatus(200);
        }
    });
};
