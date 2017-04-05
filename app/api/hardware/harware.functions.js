'use strict';

var ComponentFunctions = require('./component/component.functions.js'),
    RobotFunctions = require('./robot/robot.functions.js'),
    BoardFunctions = require('./board/board.functions.js'),
    KitFunctions = require('./kit/kit.functions.js'),
    async = require('async'),
    _ = require('lodash');

exports.getDefault = function(next) {
    async.parallel([
        RobotFunctions.getAll.bind(RobotFunctions),
        BoardFunctions.getAll.bind(BoardFunctions),
        ComponentFunctions.getAll.bind(ComponentFunctions)
    ], function(err, result){
        var defaultHardware = {
            robots: result[0],
            boards: result[1],
            components: result[2]
        };
        next(err, defaultHardware);
    });
};
