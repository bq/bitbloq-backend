'use strict';

var Component = require('./component.model.js');

/**
 * Get public Component list
 */
exports.get = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {};

    Component.find(query)
        .sort({
            name: 'asc'
        }).exec(function(err, components) {
            if (err) {
                console.log(err);
                err.code = (err.code && err.code.match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                res.status(200).json(components);
            }
        });

};
