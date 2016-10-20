'use strict';
var request = require('request-promise'),
    User = require('./user.model.js'),
    config = require('../../res/config.js'),
    jwt = require('jsonwebtoken'),
    async = require('async'),
    _ = require('lodash');


/**
 * Return if user is banned
 * @param {String} userId
 * @return {Function} next
 */
exports.isBanned = function(userId, next) {
    User.findById(userId, function(err, user) {
        if (user && user.bannedInForum) {
            next(err, true);
        } else {
            next(err, false);
        }
    });
};


/**
 * Get a single profile user
 * @param {String} userId
 * @return {Function} next
 */
exports.getUserProfile = function(userId, next) {
    User.findById(userId, function(err, user) {
        if (err) {
            next(err);
        } else if (user) {
            next(err, user.profile);
        } else {
            next();
        }
    });
};

/**
 * Get users by username regex
 * @param {String} username
 * @return {Function} next
 */
exports.getUserIdsByName = function(username, next) {
    if (username['$regex']) {
        username['$regex'] = username['$regex'].toLowerCase();
    }
    User.find({username: username}, '_id', function(err, user) {
        if (err) {
            next(err);
        } else if (user) {
            next(err, user);
        } else {
            next();
        }
    });
};

/**
 * Get an user id
 * @param {String} email
 * @return {Function} next
 */
exports.getUserId = function(email, next) {
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            next(err);
        } else if (user) {
            next(err, user._id);
        } else {
            next();
        }
    });
};

/**
 * Get an user
 * @param {String} email
 * @return {Function} next
 */
exports.getUserByEmail = function(email, next) {
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            next(err);
        } else if (user) {
            next(err, user.owner);
        } else {
            next();
        }
    });
};


/**
 * Get users
 * @param {String} emails
 * @return {Function} next
 */
exports.getAllUsersByEmails = function(emails, next) {
    async.map(emails, exports.getUserByEmail, function(err, userIds) {
        next(err, userIds);
    });
};

/**
 * if user is center admin, get the center information.
 * if centerId isn't an attribute, it returns first center that user is admin
 * @param {String} userId
 * @param {String} centerId
 * @return {Function} next
 */
exports.getCenterWithUserAdmin = function(userId, centerId, next) {
    async.waterfall([
        User.findById.bind(User, userId),
        function(user, next) {
            var myCenterId;
            _.forEach(user.centers, function(center) {
                if ((centerId && String(center._id) === String(centerId) && center.role === 'headMaster') || (!centerId && center.role === 'headMaster')) {
                    myCenterId = center._id;
                    next(null, myCenterId);
                }
            });
            if (!myCenterId) {
                next(401);
            }
        }
    ], function(err, result) {
        next(err, result);
    });
};

/**
 * Add an user in a center like teacher
 * @param {String} users
 * @param {String} centerId
 * @return {Function} next
 */
exports.addTeacherInCenter = function(user, centerId, next) {
    user.centers = user.centers || [];
    var centerExist = _.find(user.centers, function(center) {
        return String(center._id) === String(centerId);
    });
    if (!centerExist) {
        var newCenter = {
            _id: centerId,
            role: 'teacher'
        };
        user.centers.push(newCenter);
        User.update({
            _id: user._id
        }, {
            centers: user.centers
        }, next);
    } else {
        next(null, user);
    }
};


/**
 * Add users in a center like teachers
 * @param {String} users
 * @param {String} centerId
 * @return {Function} next
 */
exports.addAllTeachersInCenter = function(users, centerId, next) {
    async.map(users, function(user, next) {
        exports.addTeacherInCenter(user, centerId, next);
    }, function(err, completedUsers) {
        next(err, completedUsers);
    });
};


exports.generateToken = function(user, next) {
    var token = jwt.sign({
        _id: user._id
    }, config.secrets.session, {
        expiresIn: 600 * 240
    });

    next(null, {
        token: token,
        user: user.owner
    });
};


/**
 * Get google user data with token
 */

exports.getSocialProfile = function(provider, token) {
    var socialRequest;
    switch (provider) {
        case 'google':
            socialRequest = request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
            break;
        case 'facebook':
            socialRequest = request('https://graph.facebook.com/me?access_token=' + token);
            break;
    }
    return socialRequest;
};

exports.getFacebookAvatar = function(userId) {
    return request('http://graph.facebook.com/v2.5/' + userId + '/picture?type=large&redirect=false');
};
