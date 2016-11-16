'use strict';

var config = require('../../res/config.js'),
    jwt = require('jsonwebtoken'),
    expressJwt = require('express-jwt'),
    compose = require('composable-middleware'),
    User = require('../../api/user/user.model');


var validateJwt = expressJwt({
    secret: config.secrets.session,
    credentialsRequired: false
});

/**
 * Normalize token is query has access token property
 */
function normalizeToken(req, res, next) {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    next();
}

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
    // normalize access token
        .use(normalizeToken)
        // Validate jwt if available
        .use(function(req, res, next) {
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function(req, res, next) {
            if (req.user) {
                User.findById(req.user._id, function(err, user) {
                    if (err) {
                        console.log(err);
                        res.status(err.code).send(err);
                    } else {
                        if (!user) {
                            res.sendStatus(404);
                        } else if (!user.isValidated()) {
                            res.sendStatus(404);
                        } else {
                            req.user = user;
                            next();
                        }
                    }
                });
            } else {
                res.sendStatus(401);
            }

        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            } else {
                res.status(403).send('Forbidden');
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id, role) {
    return jwt.sign({
        _id: id,
        role: role
    }, config.secrets.session, {
        expiresIn: 600 * 240
    });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
    if (!req.user) {
        return res.status(404).send('Something went wrong, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
}

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function getUser() {
    return compose()
    // normalize access token
        .use(normalizeToken)
        // Validate jwt if available
        .use(function(req, res, next) {
            if (req.headers.authorization) {
                validateJwt(req, res, next);
            } else {
                next();
            }

        })
        // Attach user to request
        .use(function(req, res, next) {
            if (req.user) {
                User.findById(req.user._id, function(err, user) {
                    if (err) {
                        next();
                    } else {
                        if (!user) {
                            res.sendStatus(401);
                        }
                        req.user = user;
                        next();
                    }
                });

            } else {
                next();
            }
        });
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
exports.getUser = getUser;
