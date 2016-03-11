'use strict';

var User = require('./user.model'),
    Promise = require('bluebird');

/**
 * Get a single profile user (Promise Function)
 * @param {String} userId
 * @return {Promise} userProfile
 */
exports.getUserProfile = function(userId) {
    var deferred = Promise.defer();
    User.findByIdAsync(userId).then(function(user) {
        if (!user) {
            deferred.reject();
        } else {
            deferred.resolve(user.profile);
        }
    }).catch(function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * Return a user id (Promise Function)
 * @param {String} email
 * @return {Promise} userId
 */
exports.getUserId = function(email) {
    var deferred = Promise.defer();
    var query = User.where({
        email: email
    });

    query.findOne(function(err, user) {
        if (err) {
            deferred.reject(err);
        } else if (user) {
            deferred.resolve(user._id);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};
