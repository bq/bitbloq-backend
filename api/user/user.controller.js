'use strict';

var User = require('./user.model'),
    UserFunctions = require('./user.functions'),
    Token = require('../recovery/token.model'),
    utils = require('../utils'),
    config = require('../../config/environment'),
    jwt = require('jsonwebtoken'),
    auth = require('../../components/auth/auth.service'),
    mailer = require('../../components/mailer'),
    async = require('async');

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {

    var limit = req.query.limit || 0;
    var skip = req.query.skip || 0;
    var sortKey = req.query.sortKey || '_id';
    var sortParam = req.query.sortParam || 'asc';
    var query = req.query.queryParams || {};
    var sort = {};

    sort[sortKey] = sortParam;

    return User.find(query, '-salt -password')
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .exec(function(err, users) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(users);
            }
        });
};

/**
 * Creates a new user
 */
exports.create = function(req, res) {

    if (req.body.email && req.body.password) {
        var newUser = new User(req.body);
        newUser.provider = 'local';
        newUser.role = 'user';

        newUser.save(function(err, user) {
            if (err) {
                res.status(409).send(err);
            } else {
                if (user) {
                    var token = jwt.sign({
                        _id: user._id
                    }, config.secrets.session, {
                        expiresIn: 600 * 240
                    });
                    res.json({
                        token: token
                    });
                } else {
                    res.sendStatus(500);
                }
            }
        });
    }
};

/**
 * Social login
 */

//WATERFALL
exports.socialLogin = function(req, res) {

    var provider = req.body.provider;
    var token = req.body.accessToken;
    switch (provider) {
        case 'google':
            UserFunctions.getGoogleSocialProfile(token).then(function(response) {
                try {
                    response = JSON.parse(response);
                } catch (err) {
                    return res.status(422).send(err);
                }
                var query = User.where({
                    $or: [{
                        email: response.email
                    }, {
                        facebookEmail: response.email
                    }, {
                        googleEmail: response.email
                    }]
                });

                query.findOne(query, function(err, user) {
                    if (err) {
                        res.status(422).send(err);
                    }
                    if (user) {
                        if (user.googleEmail === '') {

                            User.update({
                                _id: user._id
                            }, {
                                $set: {
                                    googleEmail: response.email
                                }
                            }, function(err, user) {
                                var token = jwt.sign({
                                    _id: user._id
                                }, config.secrets.session, {
                                    expiresIn: 600 * 240
                                });
                                res.status(200).json({
                                    token: token,
                                    user: user.owner
                                }).end();
                            });
                        } else {
                            var token = jwt.sign({
                                _id: user._id
                            }, config.secrets.session, {
                                expiresIn: 600 * 240
                            });
                            res.status(200).json({
                                token: token,
                                user: user.owner
                            });
                        }
                    } else {
                        var userData = {
                            firstName: response.given_name,
                            lastName: response.family_name,
                            email: response.email,
                            googleEmail: response.email,
                            properties: {
                                avatar: response.picture
                            },
                            provider: 'social'
                        };
                        var newUser = new User(userData);
                        newUser.role = 'user';

                        newUser.saveAsync().then(function(user) {
                            var token = jwt.sign({
                                _id: user._id
                            }, config.secrets.session, {
                                expiresIn: 600 * 240
                            });
                            res.json({
                                token: token,
                                user: user.owner
                            });
                        }, function(err) {
                            return res.status(422).json(err);
                        });
                    }
                });

            }).catch(utils.handleError(res));
            break;
        case 'facebook':
            UserFunctions.getFacebookSocialProfile(token).then(function(response) {
                try {
                    response = JSON.parse(response);
                } catch (err) {
                    res.status(422).send(err).end();
                }
                var query = User.where({
                    $or: [{
                        email: response.email
                    }, {
                        facebookEmail: response.email
                    }, {
                        googleEmail: response.email
                    }]
                });

                query.findOne(query, function(err, user) {
                    if (err) {
                        res.status(404).send(err).end();
                    }
                    if (user) {
                        if (user.facebookEmail === '') {
                            User.update({
                                _id: user._id
                            }, {
                                $set: {
                                    facebookEmail: response.email
                                }
                            }, function(err, user) {
                                var token = jwt.sign({
                                    _id: user._id
                                }, config.secrets.session, {
                                    expiresIn: 600 * 240
                                });
                                res.status(200).json({
                                    token: token,
                                    user: user.owner
                                }).end();
                            });
                        } else {
                            var token = jwt.sign({
                                _id: user._id
                            }, config.secrets.session, {
                                expiresIn: 600 * 240
                            });
                            res.status(200).json({
                                token: token,
                                user: user.owner
                            }).end();
                        }
                    } else {
                        UserFunctions.getFacebookAvatar(response.id).then(function(avatar) {
                            var userData = {
                                firstName: response.first_name,
                                lastName: response.last_name,
                                email: response.email,
                                facebookEmail: response.email,
                                properties: {
                                    avatar: ''
                                },
                                provider: 'social'
                            };

                            try {
                                avatar = JSON.parse(avatar);
                                if (avatar.data && !avatar.error) {
                                    userData.properties.avatar = avatar.data.url;
                                }
                            } catch (err) {
                                console.log('No avatar', err);
                            }

                            var newUser = new User(userData);
                            newUser.role = 'user';
                            newUser.saveAsync().then(function(user) {
                                var token = jwt.sign({
                                    _id: user._id
                                }, config.secrets.session, {
                                    expiresIn: 600 * 240
                                });
                                res.json({
                                    token: token,
                                    user: user.owner
                                });
                            }, function(err) {
                                return res.status(422).json(err);
                            });
                        });
                    }
                });

            }).catch(utils.handleError(res));
            break;
        default:
            throw 'Error: not a provider';
    }
};

/**
 * Returns if a user exists
 */
exports.usernameExists = function(req, res) {
    var username = req.params.username;

    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            res.status(500).send(err);
        } else if (user) {
            res.status(200).set({
                'exists': true
            }).send();
        } else {
            res.status(204).set({
                'exists': false
            }).send();
        }
    });
};

/**
 * Show a single profile user
 */
exports.show = function(req, res) {

    var userId = req.params.id;

    UserFunctions.getUserProfile(userId, function(err, userProfile) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (userProfile) {
                res.status(200).json(userProfile);
            } else {
                res.sendStatus(404);
            }
        }
    })

};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {

    User.findById(req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(204);
        }
    });

};

/**
 * Give password to a social user
 */ //WATERFALL
exports.turnToLocal = function(req, res) {

    var userId = req.user._id;
    var newPass = String(req.body.newPassword);

    User.findByIdAsync(userId).then(function(user) {
        if (!user.password) {
            user.password = newPass;

            user.provider = 'local';
            user.saveAsync().then(function() {
                res.status(200).end();
            });
        } else {
            utils.handleError(res, 401, {
                Error: 'That user already has password'
            });
        }
    }).catch(utils.handleError(res));
};
/**
 * Change a users password
 */

//WATERFALL
exports.changePassword = function(req, res) {
    var userId = req.user._id;

    // var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    Token.findById(userId, function(err, recoveryToken) {
        if (recoveryToken) {
            User.findByIdAsync(userId)
                .then(function(user) {
                    user.password = newPass;
                    return user.saveAsync()
                        .then(function() {
                            Token.remove(recoveryToken).then(function() {})
                            return res.status(204).end();
                        })
                        .catch(utils.validationError(res));
                });
        } else {
            return res.status(401).end();
        }
    })
};

/**
 * Change user password when logged
 */

//WATERFALL

exports.changePasswordAuthenticated = function(req, res) {
    var userId = req.user._id;
    var newPass = String(req.body.newPassword);

    User.findByIdAsync(userId)
        .then(function(user) {
            user.password = newPass;
            return user.saveAsync()
                .then(function() {
                    return res.status(204).end();
                })
                .catch(utils.validationError(res));
        });
};

/**
 * Reset a users password
 */

//WATERFALL
exports.resetPassword = function(req, res) {

    var email = req.params.email;
    var query = User.where({
        email: email
    });

    query.findOne(function(err, user) {
        if (err) {
            utils.handleError(err);
        } else if (user) {
            auth.sendTokenByEmail(user).then(function() {
                res.sendStatus(200);
            }, function(err) {
                utils.handleError(err);
            });
        } else {
            utils.handleError(err);
        }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res) {

    if (req) {
        var userId = req.user._id;
        User.findOne({
                _id: userId
            },
            '-salt -password',
            function(err, user) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    if (!user) {
                        res.sendStatus(401);
                    } else {
                        res.status(200).json(user.owner)
                    }
                }
            })

    } else {
        res.sendStatus(404);
    }
};

/**
 * Update my user
 */

//WATERFALL

exports.updateMe = function(req, res) {

    var reqUser = req.body,
        userId = req.user._id;

    return User.findById(userId).then(function(userToUpdate) {
        if (userToUpdate) {
            userToUpdate.username = reqUser.username || userToUpdate.username || '';
            userToUpdate.firstName = reqUser.firstName || userToUpdate.firstName || '';
            userToUpdate.lastName = reqUser.lastName || userToUpdate.lastName || '';
            userToUpdate.email = userToUpdate.email || '';
            userToUpdate.googleEmail = reqUser.googleEmail || userToUpdate.googleEmail || '';
            userToUpdate.facebookEmail = reqUser.facebookEmail || userToUpdate.facebookEmail || '';
            userToUpdate.role = 'user';
            userToUpdate.properties.avatar = reqUser.properties.avatar || userToUpdate.properties.avatar || '';
            userToUpdate.properties.language = reqUser.properties.language || userToUpdate.properties.language || 'es-ES';
            userToUpdate.properties.newsletter = reqUser.properties.newsletter || userToUpdate.properties.newsletter || '';
            userToUpdate.properties.cookiePolicyAccepted = reqUser.properties.cookiePolicyAccepted || userToUpdate.properties.cookiePolicyAccepted || '';
            userToUpdate.properties.hasBeenAskedIfTeacher = reqUser.properties.hasBeenAskedIfTeacher || userToUpdate.properties.hasBeenAskedIfTeacher || '';

            return User.updateAsync({
                _id: userId
            }, userToUpdate).then(function() {
                return res.status(200).end();
            });
        } else {
            return res.sendStatus(204);
        }
    });
};

/**
 * Update my user properties
 */
exports.updateMyProperties = function(req, res) {

    var userProperties = req.body.properties,
        userId = req.user._id;

    // Prevent updating sensitive information
    var userToUpdate = {
        'properties': {
            'newsletter': userProperties.newsletter,
            'language': userProperties.language,
            'cookiePolicyAccepted': userProperties.cookiePolicyAccepted,
            'hasBeenAskedIfTeacher': userProperties.hasBeenAskedIfTeacher
        }
    };

    User.findByIdAndUpdate(userId, userToUpdate, {
        new: true
    }, function(err, user) {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(user.owner);
    });
};
/**
 * Return a user id
 */

//
exports.getUserId = function(req, res) {
    UserFunctions.getUserId(req.params.email, function(err, userId) {
        if (userId) {
            res.status(200).json({
                'user': userId
            });
        } else {
            res.status(400).send({
                'error': 'This email is not registered'
            });
        }

    })
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {

    res.redirect('/');
};

/**
 * Send token by email
 */

//WATERFALL
exports.emailToken = function(req, res) {
    var email = req.body.email;
    var subject = 'Cambio de clave en Bitbloq';
    User.findOneAsync({
        email: req.body.email
    }).then(function(user) {

        //En este punto tenemos el id con user._id
        //Buscamos si el usuario user._id tiene token en la base de datos. Si tiene,
        //No generamos uno nuevo. Si no tiene, porque le ha expirado o porque no lo
        //había generado, le firmamos uno y le generamos la clave

        var token = jwt.sign({
                _id: user._id
            }, config.secrets.session, {}),
            url = config.CLIENT_DOMAIN + '/#/recovery/' + token,
            locals = {
                email: email,
                subject: subject,
                resetUrl: url
            };

        var tokenModel = new Token({
            'userId': user._id,
            'token': token
        });
        tokenModel.saveAsync().then(function() {
                mailer.sendOne('password_reset', locals, function(err) {
                    if (err) {
                        utils.handleError(res);
                    }
                    res.sendStatus(200);
                });
            })
            .catch(utils.handleError);
    })
};

/**
 * Ban a user in forum
 */
exports.banUserInForum = function(req, res) {
    var userId = req.params.id;

    User.findByIdAndUpdate(userId, {
        bannedInForum: true
    }, function(err, user) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200).json(user.owner);
        }
    });
};

/**
 * Unban a user in forum
 */
exports.unbanUserInForum = function(req, res) {
    var userId = req.params.id;

    User.findByIdAndUpdate(userId, {
        bannedInForum: false
    }, function(err, user) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200).json(user.owner);
        }
    });
};

/**
 * Get all banned users
 */
exports.showBannedUsers = function(req, res) {

    User.find({
        bannedInForum: true
    }, function(err, users) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(users);
        }
    })
};
