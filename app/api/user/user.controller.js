'use strict';

var User = require('./user.model.js'),
    UserFunctions = require('./user.functions.js'),
    ImageFunctions = require('../image/image.functions.js'),
    Token = require('../recovery/token.model.js'),
    AuthorizationToken = require('../authorization/token.model.js'),
    HardwareFunctions = require('../hardware/hardware.functions.js'),
    config = require('../../res/config.js'),
    jwt = require('jsonwebtoken'),
    mailer = require('../../components/mailer'),
    async = require('async'),
    utils = require('../utils'),
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
                console.log(err);
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
                console.log(err);
                res.status(409).send(err);
            } else {
                if (user) {
                    if (newUser.needValidation) {
                        sendEmailTutorAuthorization(user, function(err) {
                            if (err) {
                                console.log(err);
                                err.code = utils.getValidHttpErrorCode(err);
                                res.status(err.code).send(err);
                            } else {
                                var tokenObject = generateToken(user);
                                res.status(200).send(tokenObject);
                            }
                        });
                    } else {
                        var tokenObject = generateToken(user);
                        res.status(200).send(tokenObject);
                    }
                } else {
                    res.sendStatus(404);
                }
            }
        });
    } else {
        res.sendStatus(400);
    }
};

/**
 * authorize a younger user
 */
exports.authorizeUser = function(req, res) {
    var tutorToken = req.body.token,
        userData = req.body.userData;
    async.waterfall([
        AuthorizationToken.findOne.bind(AuthorizationToken, {
            token: tutorToken
        }),
        function(token, next) {
            if (token) {
                User.findById(token._id, next);
            } else {
                next({
                    code: 401,
                    message: 'Internal Server Error'
                });
            }
        },
        function(user, next) {
            if (user) {
                if (!userData.tutor.validation.result) {
                    user.anonymize('rejectByTutor', next);
                } else {
                    userData.needValidation = false;
                    userData.tutor.validation.date = Date.now();
                    user.update(userData, next);
                }
            } else {
                next({
                    code: 404,
                    message: 'Not Found'
                });
            }
        },
        function(user, next2, next) {
            AuthorizationToken.remove({
                token: tutorToken
            }, next || next2);
        }
    ], function(err) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }

    });
};

exports.getUser = function(req, res) {
    var tutorToken = req.params.token;
    async.waterfall([
        AuthorizationToken.findOne.bind(AuthorizationToken, {
            token: tutorToken
        }),
        function(token, next) {
            if (token) {
                User.findById(token._id, next);
            } else {
                next({
                    code: 401,
                    message: 'Internal Server Error'
                });
            }
        }
    ], function(err, user) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            res.status(200).send(user);
        }

    });
};

function generateToken(user) {
    var token = jwt.sign({
        _id: user._id
    }, config.secrets.session, {
        expiresIn: 600 * 240
    });

    return {
        token: token,
        user: user.owner
    };
}

function sendEmailTutorAuthorization(user, next) {
    var token = jwt.sign({
        _id: user._id,
        email: user.tutor.email
    }, config.secrets.session, {});

    var tokenModel = new AuthorizationToken({
        'userId': user._id,
        'token': token
    });
    tokenModel.save();

    var authorizationUrl = config.client_domain + '/#/under14authorization/' + token;

    var params = {
        email: user.tutor.email,
        subject: 'Autorización de registro en Bitbloq',
        username: user.username,
        useremail: user.email,
        tutorname: user.tutor.firstName,
        authorizationUrl: authorizationUrl
    };

    mailer.sendOne('under14Authorization', params, next);
}

function findUserBySocialNetwork(provider, token, next) {
    UserFunctions.getSocialProfile(provider, token, function(err, response) {
        if (err) {
            next(err, response);
        } else {
            var userSocial = JSON.parse(response.body);

            if (userSocial.error) {
                next({
                    'code': 503,
                    'message': 'literal'
                });
            } else {
                if (provider === 'google' && userSocial.emails) {
                    userSocial.email = userSocial.emails[0].value;
                }
                User.findOne({
                    $or: [{
                        'social.facebook.id': userSocial.id

                    }, {
                        'social.google.id': userSocial.id
                    }]
                }, function(err, user) {
                    if (!user) {
                        next(err, userSocial);
                    } else {
                        next(err, user);
                    }
                });
            }
        }
    });
}

function generateSocialUser(provider, user) {
    var userData = {
        firstName: '',
        lastName: '',
        email: user.email,
        social: {
            google: {
                id: '',
                ageRange: {}
            },
            facebook: {
                id: '',
                ageRange: {}
            }
        }
    };

    if (user.birthday && !user.birthday.includes('0000-')) {
        userData.birthday = user.birthday;
    }

    switch (provider) {
        case 'google':
            userData.firstName = user.name.givenName;
            userData.lastName = user.name.familyName;
            userData.social.google.id = user.id;
            userData.social.google.ageRange = user.ageRange;
            break;
        case 'facebook':
            userData.firstName = user.first_name;
            userData.lastName = user.last_name;
            userData.social.facebook.id = user.id;
            userData.social.facebook.ageRange = user.age_range;
            break;
    }
    return userData;
}

function getSocialAvatar(provider, user, callback) {
    switch (provider) {
        case 'google':
            callback(null, user.image.url.split('?')[0]);
            break;
        case 'facebook':
            UserFunctions.getFacebookAvatar(user.id, function(err, response) {
                try {
                    var avatar = JSON.parse(response.body);

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

function updateWithSocialNetwork(provider, userId, socialUser, userCallback) {
    switch (provider) {
        case 'google':
            User.update({
                _id: userId
            }, {
                $set: {
                    'social.google': {
                        id: socialUser.id,
                        ageRange: socialUser.ageRange
                    }
                }
            }, userCallback);
            break;
        case 'facebook':
            User.update({
                _id: userId
            }, {
                $set: {
                    'social.facebook': {
                        id: socialUser.id,
                        ageRange: socialUser.age_range
                    }
                }
            }, userCallback);
            break;
    }

}

function searchSocialByEmail(user, socialCallback) {

    User.findOne({
        'email': user.email
    }, function(err, user) {
        if (!user) {
            socialCallback(err);
        } else {
            socialCallback(err, user);
        }
    });
}

/**
 * Social login
 */

exports.socialLogin = function(req, res) {
    var provider = req.body.provider,
        token = req.body.accessToken,
        register = req.body.register,
        username = req.body.username,
        email = req.body.email,
        hasBeenAskedIfTeacher = req.body.hasBeenAskedIfTeacher,
        birthday = req.body.birthday,
        needValidation = req.body.needValidation,
        tutor = req.body.tutor;

    findUserBySocialNetwork(provider, token, function(err, user) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            if (user) {
                if (user.role) {
                    // it's local user and user is linked by this social network
                    if (req.user) {
                        res.status(409).json({
                            message: 'Account already linked to other user'
                        });
                    } else {
                        //login
                        var tokenObject = generateToken(user);
                        res.status(200).send(tokenObject);
                    }
                } else {
                    // user doesn't exist in our bbdd
                    if (req.user) {
                        //user is registered with an email and user link with other email
                        updateWithSocialNetwork(provider, req.user._id, user, function(err) {
                            if (err) {
                                console.log(err);
                                res.sendStatus(err.code);
                            } else {
                                res.sendStatus(200);
                            }
                        });

                    } else {
                        //register
                        searchSocialByEmail(user, function(err, localUser) {
                            if (err) {
                                console.log(err);
                                err.code = utils.getValidHttpErrorCode(err);
                                res.status(err.code).send(err);
                            } else {
                                if (!localUser) {
                                    var userData = generateSocialUser(provider, user);
                                    if (register) {
                                        var newUser = new User(userData);
                                        _.extend(newUser, {
                                            'username': username
                                        }, {
                                            'hasBeenAskedIfTeacher': hasBeenAskedIfTeacher
                                        });
                                        if (email) {
                                            _.extend(newUser, {
                                                'email': email
                                            });
                                        }
                                        _.extend(newUser, {
                                            'birthday': birthday,
                                            'needValidation': needValidation,
                                            'tutor': tutor
                                        });
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
                                                ImageFunctions.downloadAndUploadImage(avatarUrl, 'images/avatar/' + user._id.toString(), function(err) {
                                                    saveCallback(err, user);
                                                });
                                            },
                                            function(user, saveCallback) {
                                                if (newUser.needValidation) {
                                                    sendEmailTutorAuthorization(user, function(err) {
                                                        if (err) {
                                                            console.log(err);
                                                            err.code = utils.getValidHttpErrorCode(err);
                                                            res.status(err.code).send(err);
                                                        } else {
                                                            var tokenObject = generateToken(user);
                                                            saveCallback(null, tokenObject);
                                                        }
                                                    });
                                                } else {
                                                    var tokenObject = generateToken(user);
                                                    saveCallback(null, tokenObject);
                                                }
                                            }

                                        ], function(err, token) {
                                            if (err) {
                                                console.log(err);
                                                res.status(422).json(err);
                                            } else {
                                                res.status(200).send(token);
                                            }
                                        });
                                    } else {
                                        res.status(200).json({
                                            next: 'register',
                                            user: userData
                                        });
                                    }
                                } else {
                                    updateWithSocialNetwork(provider, localUser._id, user, function(err) {
                                        if (err) {
                                            console.log(err);
                                            err.code = utils.getValidHttpErrorCode(err);
                                            res.status(err.code).send(err);
                                        } else {
                                            var tokenObject = generateToken(localUser);
                                            res.status(200).send(tokenObject);
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            } else {
                res.sendStatus(404);
            }
        }
    });

};

/**
 * Returns if an email exists
 */
exports.checkEmailExists = function(req, res) {
    User.findOne({
        email: req.params.email
    }, function(err, user) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
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
 * Returns if a username exists
 */
exports.checkUsernameExists = function(req, res) {
    var username = req.params.username;

    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
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
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
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
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            res.sendStatus(204);
        }
    });

};

/**
 * Deletes logged user account
 */
exports.deleteMyAccount = function(req, res) {
    var userId = req.user._id;
    var email = String(req.body.email);
    var password = String(req.body.password);

    async.waterfall(
        [
            function(callback) {
                User.findById(userId, callback);
            },

            function(user, callback) {
                if (user.email !== email) {
                    res.status(400).send('wrongEmail');
                } else if (!user.authenticate(password)) {
                    res.status(400).send('wrongPassword');
                } else {
                    user.anonymize('requestByUser', callback);
                }
            }
        ],
        function(err) {
            if (err) {
                err.code = utils.getValidHttpErrorCode(err);
                res.status(err.code).send(err);
            } else {
                res.sendStatus(200);
            }
        }
    );
};

/**
 * Give password to a social user
 */
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
                    userCallback(409);
                }
            }
        ],
        function(err, response) {
            if (err) {
                console.log(err);
                res.status(401).send(err);
            } else if (!response) {
                res.sendStatus(304);
            } else {
                res.sendStatus(200);
            }
        });
};

/**
 * Change a users password
 */

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
        if (err) {
            console.log(err);
            res.status(401).send(err);
        } else if (!result) {
            res.sendStatus(304);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * Change user password when logged
 */

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
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else if (!result) {
            res.sendStatus(304);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res) {
    var userId = req.user.id;
    async.waterfall([
        function(next) {
            User.findById(userId)
                .select('-salt -password')
                .exec(next);
        },
        function(user, next) {
            if (user) {
                if (_hardwareIsEmpty(user.hardware)) {
                    if (user.seeBoardsUnderDevelopment) {
                        HardwareFunctions.getAllHardware(function(err, hardware) {
                            user.hardware = hardware;
                            next(err, user.owner);
                        });
                    } else {
                        HardwareFunctions.getDefault(function(err, hardware) {
                            user.hardware = hardware;
                            next(err, user.owner);
                        });
                    }
                } else {
                    next(null, user.owner);
                }
            } else {
                next(401);
            }
        }
    ], function(err, result) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            res.status(200).json(result);
        }
    });
};

/**
 * Update my user
 */
exports.updateMe = function(req, res) {
    var reqUser = req.body,
        userReq = req.user;
    delete reqUser.hardware;
    async.waterfall([
        function(callback) {
            User.findById(userReq._id, callback);
        },
        function(user, callback) {
            user = _.extend(user, reqUser);
            user.save(callback);
        }
    ], function(err, user) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            if (!user) {
                res.sendStatus(401);
            } else {
                res.sendStatus(200);
            }
        }
    });
};

/**
 * Return a user id
 */

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
            if (user) {
                Token.findByIdAndRemove(user._id, function(err) {
                    userCallback(err, user);
                });
            } else {
                res.sendStatus(404);
            }
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
                    console.log(err);
                    err.code = utils.getValidHttpErrorCode(err);
                    res.status(err.code).send(err);
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        }
    });
};

/**
 * Ban a user in forum
 */
exports.banUserInForum = function(req, res) {
    var userId = req.params.id;
    User.findById(userId, function(err, user) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            if (user) {
                user.bannedInForum = true;
                user.save({
                    validateBeforeSave: false
                }, function(err, user) {
                    if (err) {
                        console.log(err);
                        err.code = utils.getValidHttpErrorCode(err);
                        res.status(err.code).send(err);
                    } else {
                        res.status(200).json(user.owner);
                    }
                });
            } else {
                res.sendStatus(404);
            }
        }
    });
};

/**
 * Unban a user in forum
 */
exports.unbanUserInForum = function(req, res) {
    var userId = req.params.id;

    User.findById(userId, function(err, user) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            if (user) {
                user.bannedInForum = false;
                user.save({
                    validateBeforeSave: false
                }, function(err, user) {
                    if (err) {
                        console.log(err);
                        err.code = utils.getValidHttpErrorCode(err);
                        res.status(err.code).send(err);
                    } else {
                        res.status(200).json(user.owner);
                    }
                });
            } else {
                res.sendStatus(404);
            }
        }
    });
};

/**
 * Get all banned users
 */
exports.showBannedUsers = function(req, res) {
    var youngerDate = new Date();
    youngerDate.setFullYear(youngerDate.getFullYear() - 14);
    User.find({
            bannedInForum: true
        })
        .or([{
            birthday: {
                $lte: youngerDate
            }
        }, {
            birthday: {
                $exists: false
            }
        }])
        .exec(function(err, users) {
            if (err) {
                console.log(err);
                err.code = utils.getValidHttpErrorCode(err);
                res.status(err.code).send(err);
            } else {
                res.status(200).json(users);
            }
        })
};

var numRequests = 0,
    numRequestsOK = 0,
    numRequestsKO = 0,
    numItemsCreated = 0,
    numItemsUpdated = 0;

exports.createAll = function(req, res) {
    numRequests++;

    if (req.body.length > 0) {
        async.each(req.body, function(item, done) {
            User.findOne({
                '_id': item._id
            }, function(err, user) {
                console.log(numItemsCreated, numItemsUpdated);
                if (err) {
                    done(err);
                } else if (user) {
                    numItemsUpdated++;
                    user.update(item, done);
                } else {
                    numItemsCreated++;
                    var newUser = new User(item);
                    newUser.save(done);
                }
            });

        }, function(err) {
            console.log('Finish request');
            console.log('numRequests:', numRequests, 'numRequestsOK:', numRequestsOK, 'numRequestsKO:', numRequestsKO);
            console.log(numItemsCreated, numItemsUpdated);
            if (err) {
                numRequestsKO++;
                console.log(err);
                err.code = utils.getValidHttpErrorCode(err);
                res.status(err.code).send(err);
            } else {
                numRequestsOK++;
                res.sendStatus(200);
            }
        });
    } else {
        res.send(200);
    }
};

exports.deleteAll = function(req, res) {
    User.find({})
        .exec(function(err, users) {
            if (err) {
                console.log(err);
                err.code = utils.getValidHttpErrorCode(err);
                res.status(err.code).send(err);
            } else {
                async.map(users, function(user, callBack) {
                    user.delete(callBack);
                }, function() {
                    res.sendStatus(200);
                });
            }
        });
};

exports.addHardware = function(req, res) {
    var userId = req.user._id,
        hardware = req.body.hardware;
    User.findById(userId, function(err, user) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            if (user) {
                var userToUpdate = user;
                userToUpdate.hardware = hardware;
                user.update(userToUpdate, function(err) {
                    if (err) {
                        console.log(err);
                        err.code = utils.getValidHttpErrorCode(err);
                        res.status(err.code).send(err);
                    } else {
                        HardwareFunctions.getHardware(userToUpdate.hardware, function(err, userHardware) {
                            if (err) {
                                console.log(err);
                                err.code = utils.getValidHttpErrorCode(err);
                                res.status(err.code).send(err);
                            } else {
                                res.status(200).json(userHardware);
                            }
                        });
                    }
                });
            }
        }
    });
};

/************************
 * PRIVATE FUNCTIONS
 ************************/

function _hardwareIsEmpty(hardware) {
    return (!hardware || (hardware.robots.length === 0 && hardware.boards.length === 0 && hardware.components.length === 0));
}
