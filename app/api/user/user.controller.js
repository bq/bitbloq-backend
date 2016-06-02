'use strict';

var User = require('./user.model.js'),
    UserFunctions = require('./user.functions.js'),
    ImageFunctions = require('../image/image.functions.js'),
    Token = require('../recovery/token.model.js'),
    config = require('../../res/config.js'),
    jwt = require('jsonwebtoken'),
    auth = require('../../components/auth/auth.service'),
    mailer = require('../../components/mailer'),
    async = require('async'),
    _ = require('lodash');

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
        .skip(parseInt(skip))
        .limit(parseInt(limit))
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

function findUserBySocialNetwork(provider, token, socialCallback) {

    UserFunctions.getSocialProfile(provider, token, socialCallback).then(function(response) {
        response = JSON.parse(response);
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
        }, function(err, user) {
            if (!user) {
                socialCallback(err, response);
            } else {
                socialCallback(err, user);
            }
        });
    });
}

function existsSocialEmail(provider, user) {
    var exists = false;
    if (user.social) {
        switch (provider) {
            case 'facebook':
                if (user.social.facebook && user.social.facebook.email !== '') {
                    exists = true;
                }
                break;
            case 'google':
                if (user.social.google && user.social.google.email !== '') {
                    exists = true;
                }
                break;
        }
    }
    return exists;
}

function generateSocialUser(provider, user) {
    var userData = {
        firstName: '',
        lastName: '',
        email: '',
        social: {
            google: {
                email: ''
            },
            facebook: {
                email: ''
            }
        }

    };

    switch (provider) {
        case 'google':
            userData.firstName = user.given_name;
            userData.lastName = user.family_name;
            userData.email = user.email;
            userData.social.google.email = user.email;
            break;
        case 'facebook':
            userData.firstName = user.first_name;
            userData.lastName = user.last_name;
            userData.email = user.email;
            userData.social.facebook.email = user.email;
            break;
    }

    var newUser = new User(userData);
    newUser.role = 'user';
    return newUser;

}

function getSocialAvatar(provider, user, callback) {

    switch (provider) {
        case 'google':
            callback(null, user.picture);
            break;
        case 'facebook':
            UserFunctions.getFacebookAvatar(user.id).then(function(avatar) {

                try {
                    avatar = JSON.parse(avatar);

                    if (avatar.data && !avatar.error) {
                        callback(null, avatar.data.url);
                    } else {
                        callback(avatar.error);
                    }

                } catch (err) {
                    callback(err);
                }
            });
            break;

    }
}

function updateWithSocialNetwork(provider, user, userCallback) {
    switch (provider) {
        case 'google':
            User.update({
                _id: user._id
            }, {
                $set: {
                    'social.google': {
                        email: user.email
                    }
                }
            }, userCallback);
            break;
        case 'facebook':
            User.update({
                _id: user._id
            }, {
                $set: {
                    'social.facebook': {
                        email: user.email
                    }
                }
            }, userCallback);
            break;
    }

}

/**
 * Social login
 */

//WATERFALL
exports.socialLogin = function(req, res) {
    var provider = req.body.provider;
    var token = req.body.accessToken;

    findUserBySocialNetwork(provider, token, function(err, user) {

        if (user) {
            if (req.user) {
                if (existsSocialEmail(provider, req.user)) {
                    UserFunctions.generateToken(user, function(err, response) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            if (response) {
                                res.status(200).send(response);
                            } else {
                                res.sendStatus(409);
                            }
                        }
                    });
                } else {
                    if (req.user.email !== user.email) {
                        res.sendStatus(409);
                    } else {
                        updateWithSocialNetwork(provider, user, function(err) {
                            if (err) {
                                res.sendStatus(500);
                            } else {
                                res.sendStatus(200);
                            }
                        });
                    }
                }
            } else {
                if (existsSocialEmail(provider, user)) {
                    UserFunctions.generateToken(user, function(err, response) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            if (response) {
                                res.status(200).send(response);
                            }
                        }
                    });
                } else {
                    async.waterfall([
                        function(userCallback) {
                            updateWithSocialNetwork(provider, user, userCallback);
                        },
                        function(userSocial, userCallback) {
                            UserFunctions.generateToken(user, userCallback);
                        }

                    ], function(err, response) {
                        if (response) {
                            res.status(200).send(response);
                        } else {
                            res.status(500).send(err);
                        }
                    });
                }
            }

        } else {
            var newUser = generateSocialUser(provider, user);

            async.waterfall([
                function(saveCallback) {
                    getSocialAvatar(provider, user, saveCallback);
                },
                function(avatarUrl, saveCallback) {
                    newUser.save(function(err, user) {
                        saveCallback(err, user, avatarUrl);
                    });
                },
                function(user, avatarUrl, saveCallback) {
                    ImageFunctions.downloadAndUploadImage(avatarUrl, 'images/avatar/' + user._id.toString());
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
                userCallback(500);
            }
        }

    ], function(err, result) {
        if (result) {
            res.sendStatus(200);
        } else {
            res.status(500).send(err);
        }

    });

};

/**
 * Get my info
 */
exports.me = function(req, res) {
    if (req) {
        var userReq = req.user;
        if (userReq) {
            var userId = userReq.id;
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
        }
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
        function(callback) {
            User.findById(userId, callback)
        },
        function(user, callback) {
            user = _.extend(user, reqUser);
            user.save(callback);
        }
    ], function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
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
            Token.findByIdAndRemove(user._id, function(err) {
                userCallback(err, user);
            });
        },
        function(user, userCallback) {
            var token = jwt.sign({
                    _id: user._id
                }, config.secrets.session, {}),
                url = config.client_domain + '/#/recovery/' + token;
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
            mailer.sendOne('resetPassword', locals, function(err) {
                if (err) {
                    res.status(500).send(err);
                }
                res.sendStatus(200);
            });
        } else {
            res.status(500).send(err);
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
            res.status(200).json(user.owner);
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
            res.status(200).json(user.owner);
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

var numRequests = 0,
    numRequestsOK = 0,
    numRequestsKO = 0,
    numItems = 0;

exports.createAll = function(req, res) {
    numRequests++;
    console.log('numRequest', numRequests);
    async.each(req.body, function(item, done) {
        // console.log('item');
        // console.log(item);
        // console.log(item._id);
        User.findByIdAndUpdate(item._id, item, {
            upsert: true
        }, done);
    }, function(err) {
        console.log('Finish request');
        console.log('numRequests:', numRequests, 'numRequestsOK:', numRequestsOK, 'numRequestsKO:', numRequestsKO);
        if (err) {
            numRequestsKO++;
            console.log('err');
            console.log(err);
            res.status(500).send(err);
        } else {
            numRequestsOK++;
            res.sendStatus(200);
        }
    });

};

exports.deleteAll = function(req, res) {
    User.remove({}, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};
