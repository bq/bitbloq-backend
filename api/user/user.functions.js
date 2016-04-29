'use strict';
var request = require('request-promise');
var User = require('./user.model');


/**
 * Get a single profile user (Promise Function)
 * @param {String} userId
 * @return {Promise} userProfile
 */
exports.getUserProfile = function(userId, next) {

    User.find(userId, function(err, user) {
        if (err) {
            next(err);
        } else if (user) {
            next(user.profile);
        } else {
            next();
        }
    });
};

/**
 * Return a user id (Promise Function)
 * @param {String} email
 * @return {Promise} userId
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
 * Get google user data with token
 */
exports.getGoogleSocialProfile = function(token) {
    return request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
};

/**
 * Get facebook user data with token
 */
exports.getFacebookSocialProfile = function(token) {
    return request('https://graph.facebook.com/me?access_token=' + token);
};

exports.getFacebookAvatar = function(userId) {
    return request('http://graph.facebook.com/v2.5/' + userId + '/picture?redirect=false');
};
