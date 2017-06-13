'use strict';

var Robot = require('./robot.model.js'),
    ComponentFunctions = require('../component/component.functions.js'),
    _ = require('lodash'),
    async = require('async');

exports.getAll = function(next) {
    Robot.find({})
        .sort({
            order: 'asc'
        })
        .exec(next);
};

exports.getAllWithoutDevelopment = function(next) {
    Robot.find({})
        .where('underDevelopment').in([false, undefined, null])
        .sort({
            order: 'asc'
        })
        .exec(next);
};

exports.getRobotsInArray = function(arrayId, next) {
    if (arrayId.length > 0) {
        Robot.find({})
            .where('_id').in(arrayId)
            .sort({
                order: 'asc'
            })
            .exec(next);
    } else {
        next(null, []);
    }

};

exports.includedInRobots = function(component, robotUuids, next) {
    ComponentFunctions.getByUuid(component.uuid, function(err, component) {
        Robot.find({})
            .where('uuid').in(robotUuids)
            .exec(function(err, robots) {
                if (err) {
                    next(err);
                } else if (robots.length > 0) {
                    async.map(robots, function(robot, callback) {
                        robot.includedComponents.push(component._id);
                        robot.includedComponents = _.uniqWith(robot.includedComponents, _.isEqual);
                        robot.save(callback);
                    }, next);
                } else {
                    next();
                }
            });
    });
};

exports.createRobot = function(newRobot, next) {
    Robot.findOne({uuid: newRobot.uuid}, function(err, robot) {
        if (err) {
            next(err);
        } else if (robot) {
            _.extend(robot, newRobot);
            robot.save(next);
        } else {
            Robot.create(newRobot, next);
        }
    });
};