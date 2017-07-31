'use strict';

var Component = require('./component.model.js'),
    utils = require('../../utils');

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
                err.code = utils.getValidHttpErrorCode(err);
                res.status(err.code).send(err);
            } else {
                res.status(200).json(components);
            }
        });

};
