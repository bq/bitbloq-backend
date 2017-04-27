'use strict';

var HardwareFunctions = require('./hardware.functions.js');

/**
 * Get hardware
 */
exports.getAllHardware = function(req, res) {
    HardwareFunctions.getAllHardware(function(err, result) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).json(result);
        }
    });
};
