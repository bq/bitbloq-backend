'use strict';

var User = require('./user.model'),
    Promise = require('bluebird');

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
