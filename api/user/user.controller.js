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
    var responseSocial;
    switch (provider) {
        case 'google':
            async.waterfall([
                function(socialCallback) {
                    UserFunctions.getGoogleSocialProfile(token, socialCallback).then(function(response) {
                        response = JSON.parse(response);
                        responseSocial = response;
                        User.findOne({
                            $or: [{
                                email: response.email
                            }, {
                                social: {
                                    facebook: {
                                        email: response.email
                                    }
                                }
                            }, {
                                social: {
                                    google: {
                                        email: response.email
                                    }
                                }
                            }]
                        }, socialCallback);
                    });
                }

            ], function(err, user) {
                if (err) {
                    res.sendStatus(422);
                }
                if (user) {
                    if (user.social.google.email === '') {
                        async.waterfall([
                            function(userCallback) {
                                User.update({
                                    _id: user._id
                                }, {
                                    $set: {
                                        social: {
                                            google: {
                                                email: responseSocial.email,
                                                id: responseSocial.id
                                            }
                                        }
                                    }
                                }, userCallback);
                            },
                            function(user, userCallback) {
                                UserFunctions.generateToken(user, userCallback);
                            }
                        ], function(err, response) {
                            if (response) {
                                res.status(200).send(response);
                            } else {
                                res.sendStatus(500);
                            }
                        });
                    } else {
                        UserFunctions.generateToken(user, function(err, response) {
                            if (err) {
                                res.sendStatus(500);
                            } else {
                                if (response) {
                                    res.status(200).send(response);
                                }
                            }
                        });
                    }
                } else {
                    var userData = {
                        firstName: responseSocial.given_name,
                        lastName: responseSocial.family_name,
                        email: responseSocial.email,
                        social: {
                            google: {
                                email: responseSocial.email,
                                id: responseSocial.id,
                            }
                        },
                        properties: {
                            avatar: responseSocial.picture
                        },
                        provider: 'social'
                    };
                    var newUser = new User(userData);
                    newUser.role = 'user';

                    async.waterfall([
                        function(saveCallback) {
                            newUser.save(saveCallback);
                        },
                        function(user, saved, saveCallback) {
                            UserFunctions.generateToken(user, saveCallback);
                        }
                    ], function(err, response) {
                        if (err) {
                            res.status(422).json(err);
                        } else {
                            if (response) {
                                res.status(200).send(response);
                            }
                        }
                    });
                }

            });
            break;
        case 'facebook':
            async.waterfall([
                function(socialCallback) {
                    UserFunctions.getFacebookSocialProfile(token, socialCallback).then(function(response) {
                        try {
                            response = JSON.parse(response);
                            responseSocial = response;
                        } catch (err) {
                            socialCallback(err);
                        }
                        User.findOne({
                            $or: [{
                                email: response.email
                            }, {
                                social: {
                                    facebook: {
                                        email: response.email
                                    }
                                }
                            }, {
                                social: {
                                    google: {
                                        email: response.email
                                    }
                                }
                            }]
                        }, socialCallback);
                    });
                }

            ], function(err, user) {
                if (err) {
                    res.sendStatus(404);
                }
                if (user) {
                    if (user.social.facebook.email === '') {
                        async.waterfall([
                            function(userCallback) {
                                User.update({
                                    _id: user._id
                                }, {
                                    $set: {
                                        social: {
                                            facebook: {
                                                email: responseSocial.email,
                                                id: responseSocial.id
                                            }
                                        }
                                    }
                                }, userCallback);
                            },
                            function(user, userCallback) {
                                UserFunctions.generateToken(user, userCallback);
                            }
                        ], function(err, response) {
                            if (response) {
                                res.status(200).send(response);
                            } else {
                                res.sendStatus(500);
                            }
                        });

                    } else {
                        UserFunctions.generateToken(user, function(err, response) {
                            if (err) {
                                res.sendStatus(500);
                            } else {
                                if (response) {
                                    res.status(200).send(response);
                                }
                            }
                        });
                    }
                } else {
                    async.waterfall([
                        function(socialCallback) {
                            UserFunctions.getFacebookAvatar(responseSocial.id).then(function(avatar) {
                                var userData = {
                                    firstName: responseSocial.first_name,
                                    lastName: responseSocial.last_name,
                                    email: responseSocial.email,
                                    social: {
                                        facebook: {
                                            email: responseSocial.email,
                                            id: responseSocial.id,
                                        }
                                    },
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
                                newUser.save(socialCallback);

                            });
                        },

                        function(user, saved, socialCallback) {
                            UserFunctions.generateToken(user, socialCallback);
                        }
                    ], function(err, response) {
                        if (err) {
                            res.status(422).json(err);
                        } else {
                            if (response) {
                                res.status(200).send(response);
                            }
                        }
                    });
                }
            });
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

    async.waterfall([
            function(userCallback) {
                User.findById(userId, userCallback);
            },

            function(user, userCallback) {
                if (!user.password) {
                    user.password = newPass;
                    user.provider = 'local';

                    user.save(userCallback);
                } else {
                    userCallback(500);
                }
            }
        ],
        function(err, response) {
            if (response) {
                res.sendStatus(200);
            } else {
                if (err) {
                    res.sendStatus(401);
                }
            }
        });
};

/**
 * Change a users password
 */

//WATERFALL - done
exports.changePassword = function(req, res) {
    var userId = req.user._id;
    var tokenRec;

    var newPass = String(req.body.newPassword);

    async.waterfall([
        function(tokenCallback) {
            Token.findById(userId, tokenCallback);
        },

        function(token, tokenCallback) {
            tokenRec = token;
            if (token) {
                User.findById(token, tokenCallback);
            } else {
                tokenCallback(401);
            }
        },
        function(user, tokenCallback) {
            user.password = newPass;
            user.save(tokenCallback);
        },
        function(user, saved, tokenCallback) {
            Token.remove(tokenRec, tokenCallback);
        }
    ], function(err, result) {
        if (result) {
            res.sendStatus(204);
        } else {
            if (err) {
                res.sendStatus(err);
            }
        }
    });
};

/**
 * Change user password when logged
 */

//WATERFALL - hecho

exports.changePasswordAuthenticated = function(req, res) {
    var userId = req.user._id;
    var newPass = String(req.body.newPassword);

    async.waterfall([
        function(userCallback) {
            User.findById(userId, userCallback);
        },
        function(user, userCallback) {
            user.password = newPass;
            user.save(userCallback);
        }
    ], function(err, result) {

        if (result) {
            res.sendStatus(204);
        } else {
            if (err) {
                res.status(500).send(err);
            }
        }
    });
};

/**
 * Reset a users password
 */

//WATERFALL - hecho

exports.resetPassword = function(req, res) {

    var email = req.params.email;

    async.waterfall([
        function(userCallback) {
            User.findOne({
                email: email
            }, userCallback)
        },
        function(user, userCallback) {
            if (user) {
                auth.sendTokenByEmail(user, userCallback);
            } else {
                res.sendStatus(500);
            }
        }

    ], function(err, result) {
        if (result) {
            res.sendStatus(200);
        } else {
            if (err) {
                res.sendStatus(500);
            }
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

//WATERFALL - hecho

exports.updateMe = function(req, res) {

    var reqUser = req.body,
        userId = req.user._id;

    async.waterfall([
        function(userCallback) {
            User.findById(userId, userCallback);
        },
        function(userToUpdate, userCallback) {
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
                User.updateAsync({
                    _id: userId
                }, userToUpdate, userCallback);

            } else {
                res.sendStatus(204);
            }
        }
    ], function(err, result) {
        if (result) {
            res.sendStatus(200);
        } else {
            if (err) {
                res.sendStatus(500);
            }
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
    var locals;

    async.waterfall([
        function(userCallback) {
            User.findOne({
                email: req.body.email
            }, userCallback);
        },
        function(user, userCallback) {
            var token = jwt.sign({
                    _id: user._id
                }, config.secrets.session, {}),
                url = config.CLIENT_DOMAIN + '/#/recovery/' + token;
            locals = {
                email: email,
                subject: subject,
                resetUrl: url
            };
            var tokenModel = new Token({
                'userId': user._id,
                'token': token
            });
            tokenModel.save(userCallback);
        }
    ], function(err, result) {
        if (result) {
            mailer.sendOne('password_reset', locals, function(err) {
                if (err) {
                    res.sendStatus(500);
                }
                res.sendStatus(200);
            })
        } else {
            if (err) {
                res.sendStatus(500);
            }
        }
    });
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
