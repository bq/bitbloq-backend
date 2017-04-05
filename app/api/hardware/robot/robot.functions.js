'use strict';

var Robot = require('./robot.model.js');

exports.getAll = function(next) {
    Robot.find({}, next);
};