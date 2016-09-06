'use strict';

var Project = require('./project.model.js');

exports.deleteAllByUser = function(userId, next) {
    //todo delete images
    Project.remove({creator: userId}, next);
};
