'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service.js');

var router = express.Router();

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.status(500).json({
                message: 'Something went wrong, please try again.'
            });
        }

        if (info) {
            if (info.user === 'undefined') {
                return res.status(404).json({
                    message: 'This email is not registered, please sign up. '
                });
            } else {
                return res.status(401).json({
                    message: 'Password incorrect, please try again.'
                });
            }
        }

        var token = auth.signToken(user._id, user.role);
        res.json({
            token: token
        });
    })(req, res, next);
});

module.exports = router;
