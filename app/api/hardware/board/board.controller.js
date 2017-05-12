'use strict';

var Board = require('./board.model.js');

/**
 * Get public Board list
 */
exports.get = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {};

    Board.find(query)
        .sort({
            order: 'asc'
        })
        .exec(function(err, boards) {
            if (err) {
                console.log(err);
                err.code = (err.code && err.code.match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                res.status(200).json(boards);
            }
        });

};
