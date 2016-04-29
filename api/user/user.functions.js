'use strict';
var request = require('request-promise');
var User = require('./user.model'),
    Promise = require('bluebird');

/**
 * Get a single profile user (Promise Function)
 * @param {String} userId
 * @return {Promise} userProfile
 */
exports.getUserProfile = function(userId) {
    return new Promise(function(resolve, reject) {
        User.findByIdAsync(userId).then(function(user) {
            if (!user) {
                reject();
            } else {
                resolve(user.profile);
            }
        }).catch(function(err) {
            reject(err);
        });
    });
};

/**
 * Return a user id (Promise Function)
 * @param {String} email
 * @return {Promise} userId
 */
exports.getUserId = function(email) {
    return new Promise(function(resolve, reject) {
        var query = User.where({
            email: email
        });

        query.findOne(function(err, user) {
            if (err) {
                reject(err);
            } else if (user) {
                resolve(user._id);
            } else {
                resolve();
            }
        });
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
