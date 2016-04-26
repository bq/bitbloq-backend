'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function(User) {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password' // this is the virtual field on the model
        },
        function(email, password, done) {

            var username = '';

            email = email.toLowerCase();

            if (email.indexOf('@') === -1) {
                username = email.split('@').shift();
            }

            var query = User.where({
                $or: [{
                    email: email
                }, {
                    facebookEmail: email
                }, {
                    googleEmail: email
                }, {
                    username: username || email
                }]
            });

            User.findOne(query, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, {
                        message: 'This email is not registered.'
                    });

                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'This password is not correct.'
                    });
                }
                return done(null, user);
            });
        }
    ));
};