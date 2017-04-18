'use strict';

var ComponentFunctions = require('./component/component.functions.js'),
    RobotFunctions = require('./robot/robot.functions.js'),
    BoardFunctions = require('./board/board.functions.js'),
    async = require('async'),
    _ = require('lodash');

exports.getDefault = function(next) {
    async.parallel([
        RobotFunctions.getAllWithoutDevelopment.bind(RobotFunctions),
        BoardFunctions.getAllWithoutDevelopment.bind(BoardFunctions),
        ComponentFunctions.getAllWithoutDevelopment.bind(ComponentFunctions)
    ], function(err, result) {
        var defaultHardware = {
            robots: result[0],
            boards: result[1],
            components: result[2]
        };
        next(err, defaultHardware);
    });
};

exports.getHardware = function(hardware, next) {
    async.parallel([
        RobotFunctions.getRobotsInArray.bind(RobotFunctions, hardware.robots),
        BoardFunctions.getBoardsInArray.bind(BoardFunctions, hardware.boards),
        ComponentFunctions.getComponentsInArray.bind(ComponentFunctions, hardware.components)
    ], function(err, result) {
        var hardware = {
            robots: result[0],
            boards: result[1],
            components: result[2]
        };
        next(err, hardware);
    });
};
