'use strict';

var Project = require('./project.model.js'),
    async = require('async'),
    ImageFunctions = require('../image/image.functions.js');

exports.deleteAllByUser = function(userId, next) {
    async.waterfall([
        Project.find.bind(Project, {creator: userId}),
        function(projects, next){
            projects.forEach(function(project){
                ImageFunctions.delete('project', project._id);
            });
            next();
        },
        Project.remove.bind(Project, {creator: userId})
    ], next);
};
