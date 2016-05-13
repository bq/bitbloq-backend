'use strict';
var path = require('path');

/**
 * Get public a frimware
 */
exports.get = function(req, res) {

    var robot = req.params.robot,
        version = req.params.version,
        firmwarePath = path.join(__dirname, '..', '..', 'res','robotsFirmware', robot, version + ".hex");

   res.sendFile(firmwarePath);
};

exports.create = function(req, res) {
    //todo
};

exports.delete = function(req, res) {
    //todo
};
