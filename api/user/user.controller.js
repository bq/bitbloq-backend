'use strict';

var User = require('./user.model'),
    UserFunctions = require('./user.functions'),
    config = require('../../config/environment'),
    jwt = require('jsonwebtoken'),
    auth = require('../../components/auth/auth.service');

function validationError(res, statusCode) {
    statusCode = statusCode || 422;
    return function(err) {
        res.status(statusCode).json(err);
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
    console.log('index');
    var limit = req.query.limit || 0;
    var skip = req.query.skip || 0;
    var sortKey = req.query.sortKey || '_id';
    var sortParam = req.query.sortParam || 'asc';
    var query = req.query.queryParams || {};
    var sort = {};

    sort[sortKey] = sortParam;

    User.find(query, '-salt -password')
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .then(function(users) {
            res.status(200).send(users);
        }).catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res) {
    var newUser = new User(req.body);
    console.log(newUser);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.saveAsync().then(function(user) {
        var token = jwt.sign({
            _id: user._id
        }, config.secrets.session, {
            expiresIn: 60 * 240
        });
        res.json({
            token: token
        });
    }, function(err) {
        return res.status(422).json(err);
    });

};

/**
 * Returns if a user exists
 */
exports.usernameExists = function(req, res) {
    var username = req.params.username;
    var query = User.where({username: username});
    query.findOne(function(err, user) {
        if (err) {
            return handleError(err);
        } else if (user) {
            return res.status(200).set({'exists': true}).send();
        } else {
            return res.status(204).set({'exists': false}).send();
        }
    });
};

/**
 * Show a single profile user
 */
exports.show = function(req, res, next) {
    var userId = req.params.id;
    UserFunctions.getUserProfile(userId).then(function(userProfile) {
        res.json(userProfile);
    }).catch(function(err) {
        if (err) {
            return next(err);
        } else {
            return res.status(404).end();
        }
    });
};


/**
 * Get a single profile user (Promise Function)
 */
exports.getUserProfile = function(userId) {
    var deferred = Promise.defer();
    User.findByIdAsync(userId).then(function(user) {
        if (!user) {
            deferred.reject();
        } else {
            deferred.resolve(user.profile);
        }
    })
        .catch(function(err) {
            deferred.reject(err);
        });
    return deferred.promise;
};


/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
    User.findByIdAndRemoveAsync(req.params.id)
        .then(function() {
            res.status(204).end();
        })
        .catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findByIdAsync(userId)
        .then(function(user) {
            if (user.authenticate(oldPass)) {
                user.password = newPass;
                return user.saveAsync()
                    .then(function() {
                        res.status(204).end();
                    })
                    .catch(validationError(res));
            } else {
                return res.status(403).end();
            }
        });
};

/**
 * Reset a users password
 */
exports.resetPassword = function(req, res) {
    console.log('reset');
    var email = req.params.email;
    var query = User.where({email: email});

    query.findOne(function(err, user) {
        if (err) {
            handleError(err);
        } else if (user) {
            auth.sendTokenByEmail(user).then(function() {
                res.sendStatus(200);
            }, function(err) {
                handleError(err);
            });
        } else {
            handleError(err);
        }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
    console.log('me');
    var userId = req.user._id;

    User.findOneAsync({
        _id: userId
    }, '-salt -password')
        .then(function(user) { // don't ever give out the password or salt
            if (!user) {
                return res.status(401).end();
            }
            res.json(user.owner);
        })
        .catch(function(err) {
            return next(err);
        });
};

/**
 * Update my user
 */
exports.updateMe = function(req, res) {
    console.log('update me');
    var userId = req.user._id;
    User.findByIdAndUpdateAsync(userId, req.params.user).then(function(user) {
        res.sendStatus(200);
    }, function(err) {
        handleError(err);
    });
};

/**
 * Return a user id
 */
exports.getUserId = function(req, res) {
    console.log('user id');
    var email = req.params.email;
    var query = User.where({email: email});

    query.findOne(function(err, user) {
        if (err) {
            handleError(err);
        } else if (user) {
            res.status(200).send(user._id);
        } else {
            handleError(err);
        }
    });
};
/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};
