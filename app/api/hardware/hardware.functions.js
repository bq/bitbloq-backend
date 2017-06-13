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


exports.createBoards = function(boards, next) {
    async.map(boards, BoardFunctions.createBoard, function(err) {
        next(err);
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
                                BoardFunctions.integratedInBoard(component.included.boards.integrated, callback2);
                            } else {
                                callback2();
                            }
                        }
                    ], callback);
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
    }, function(err) {
        next(err);
    });
};

exports.createRobots = function(robots, next) {
    async.map(robots, function(robot, callback) {
        async.waterfall([
            function(callback) {
                if (robot.includedComponents) {
                    ComponentFunctions.getComponentIdsByUuids(robot.includedComponents, callback)
                } else {
                    next();
                }
            },
            function(componentIds, callback) {
                if (componentIds.length > 0) {
                    robot.includedComponents = componentIds;
                } else {
                    delete robot.includedComponents;
                }
                RobotFunctions.createRobot(robot, callback);
            }
        ], callback);
    }, function(err) {
        next(err);
    });
};


exports.createKits = function(kits, next) {
    async.map(kits, function(kit, callback) {
        async.waterfall([
            function(callback) {
                async.parallel([
                    function(callback) {
                        if (kit.components) {
                            ComponentFunctions.getComponentIdsByUuids(kit.components, callback)
                        } else {
                            callback(null, []);
                        }
                    },
                    function(callback) {
                        if (kit.boards) {
                            BoardFunctions.getBoardIdsByUuids(kit.boards, callback)
                        } else {
                            callback(null, []);
                        }
                    }
                ], callback);

            },
            function(ids, callback) {
                if (ids[0].length > 0) {
                    kit.components = ids[0];
                } else {
                    delete kit.components;
                }
                if (ids[1].length > 0) {
                    kit.boards = ids[1];
                } else {
                    delete kit.boards;
                }
                KitFunctions.createKit(kit, callback);
            }
        ], callback);
    }, function(err) {
        next(err);
    });
};