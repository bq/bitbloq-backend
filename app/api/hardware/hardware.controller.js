'use strict';

var ComponentFunctions = require('./component/component.functions.js'),
    RobotFunctions = require('./robot/robot.functions.js'),
    BoardFunctions = require('./board/board.functions.js'),
    KitFunctions = require('./kit/kit.functions.js'),
    async = require('async');

/**
 * Get hardware
 */
exports.getAllHardware = function(req, res) {
    async.parallel([
        RobotFunctions.getAll.bind(RobotFunctions),
        BoardFunctions.getAll.bind(BoardFunctions),
        ComponentFunctions.getAll.bind(ComponentFunctions),
        KitFunctions.getAll.bind(KitFunctions)
    ], function(err, result) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            var defaultHardware = {
                robots: result[0],
                boards: result[1],
                components: result[2],
                kits: result[3]
            };
            res.status(200).json(defaultHardware);
        }
    });
};
