'use strict';

var Robot = require('./robot.model.js');

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
