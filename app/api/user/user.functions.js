'use strict';
var request = require('request-promise'),
    User = require('./user.model.js'),
    config = require('../../res/config.js'),
    jwt = require('jsonwebtoken'),
    async = require('async'),
    _ = require('lodash'),
    mongoose = require('mongoose');


/**
 * Return if user is banned
 * @param {String} userId
 * @param {Function} next
 * @return {Boolean} banned
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
 * @param {Function} next
 * @return {Object} user.profile
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
 * @param {Function} next
 * @return {Object} user.owner
 */
exports.getUserIdsByName = function(username, next) {
    if (username['$regex']) {
        username['$regex'] = username['$regex'].toLowerCase();
    }
    User.find({username: username}, '_id', function(err, user) {
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
 * Get an user id
 * @param {String} email
 * @param {Function} next
 * @return {String} user Id
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
 * @param {Function} next
 * @return {Object} user.owner
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
 * @param {Function} next
 * @return {Array} userIds
 */
exports.getAllUsersByEmails = function(emails, next) {
    async.map(emails, exports.getUserByEmail, function(err, userIds) {
        next(err, userIds);
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
 * @param {String} provider
 * @param {Function} next
 * @return {Promise} request
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

/**
 * Get avatar facebook user
 * @param {String} userId
 * @param {Function} next
 * @return {Promise} request
 */
exports.getFacebookAvatar = function(userId) {
    return request('http://graph.facebook.com/v2.5/' + userId + '/picture?type=large&redirect=false');
};
