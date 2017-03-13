'use strict';
var path = require('path'),
    robotsFirmwarePath = path.join(__dirname, '..', '..', 'res', 'robotsFirmware');

function getRobotFirmwareFolder(robot) {
    return path.join(robotsFirmwarePath, robot);
}

function getRobotFirmwareName(version) {
    return version + ".hex";
}

function getRobotFirmware(robot, version) {
    return path.join(getRobotFirmwareFolder(robot), getRobotFirmwareName(version));
}

/**
 * Get public a firmware
 */
exports.get = function(req, res) {
    var robot = req.params.robot,
        version = req.params.version;

    res.sendFile(getRobotFirmware(robot, version));
};