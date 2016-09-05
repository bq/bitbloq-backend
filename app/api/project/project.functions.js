'use strict';

var Project = require('./project.model.js');

exports.deleteAllByUser = function(userId, next) {
    Project.remove({creator: userId}, next);
};
