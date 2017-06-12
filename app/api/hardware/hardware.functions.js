'use strict';

var ComponentFunctions = require('./component/component.functions.js'),
    RobotFunctions = require('./robot/robot.functions.js'),
    BoardFunctions = require('./board/board.functions.js'),
    KitFunctions = require('./kit/kit.functions.js'),
    async = require('async');

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

/**
 * Get hardware
 */
exports.getAllHardware = function(next) {
    async.parallel([
        RobotFunctions.getAll.bind(RobotFunctions),
        BoardFunctions.getAll.bind(BoardFunctions),
        ComponentFunctions.getAll.bind(ComponentFunctions),
        KitFunctions.getAll.bind(KitFunctions)
    ], function(err, result) {
        var defaultHardware = {};
        if (result) {
            defaultHardware = {
                robots: result[0],
                boards: result[1],
                components: result[2],
                kits: result[3]
            };
        }
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


exports.createComponents = function(components, next) {
    async.map(components, function(component, callback) {
        async.parallel([
            function(callback) {
                ComponentFunctions.createComponent(component.data, callback);
            },
            function(callback) {
                if (component.included && component.included.boards) {
                    async.waterfall([
                        function(callback2) {
                            if (component.included.boards.compatible) {
                                BoardFunctions.compatibleWithBoard(component.data, component.included.boards.compatible, callback2);
                            } else {
                                callback2();
                            }
                        },
                        function(callback2) {
                            if (component.included.boards.integrated) {
                                BoardFunctions.integratedInBoard(component.included.boards.integrated, callback);
                            } else {
                                callback2();
                            }
                        }
                    ], next);
                }
            },
            function(callback) {
                if (component.included) {
                    RobotFunctions.includedInRobots(component.data, component.included.robots, callback);
                }
            },
            function(callback) {
                if (component.included) {
                    KitFunctions.includedInKits(component.data, component.included.kits, callback);
                }
            }
        ], callback);
    }, next);
};