'use strict';

var Project = require('./project.model.js'),
    async = require('async'),
    ImageFunctions = require('../image/image.functions.js');

exports.deleteAllByUser = function(userId, next) {
    Project.find({
        creator: userId
    }, function(err, projects) {
        if (projects && projects.length > 0) {
            projects.forEach(function(project) {
                project.delete();
            });
        } else {
            next(err);
        }
    });
};
