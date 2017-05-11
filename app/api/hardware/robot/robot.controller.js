'use strict';

var Robot = require('./robot.model.js');

/**
 * Get public Robot list
 */
exports.get = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {};

    Robot.find(query)
        .sort({
            order: 'asc'
        })
        .exec(function(err, robots) {
            if (err) {
                console.log(err);
                err.code = parseInt(err.code) || 500;
                res.status(err.code).send(err);
            } else {
                res.status(200).json(robots);
            }
        });

};
