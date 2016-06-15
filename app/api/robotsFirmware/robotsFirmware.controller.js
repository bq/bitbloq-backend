'use strict';
var path = require('path'),
    fs = require('fs'),
    robotsFirmwarePath = path.join(__dirname, '..', '..', 'res', 'robotsFirmware'),
    multer = require('multer');

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
exports.get = function (req, res) {
    var robot = req.params.robot,
        version = req.params.version;

    res.sendFile(getRobotFirmware(robot, version));
};

exports.getMulterCreator = function () {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var robot = req.params.robot;
            cb(null, getRobotFirmwareFolder(robot))
        },
        filename: function (req, file, cb) {
            var version = req.params.version;
            cb(null, getRobotFirmwareName(version))
        }
    });
    return multer({ storage: storage });
};

exports.create = function (req, res) {
    res.sendStatus(200);
};

exports.delete = function (req, res) {
    var robot = req.params.robot,
        version = req.params.version;

    fs.unlink(getRobotFirmware(robot, version), function (err) {
        if (err) {
            res.status(500).send(err);
        }
        res.sendStatus(200);
    })
};
