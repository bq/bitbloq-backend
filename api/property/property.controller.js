'use strict';

var Property = require('./property.model'),
    utils = require('../utils');

var perPage = 20;


/**
 * Get public property list
 */
exports.getAll = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {},
        page = req.query.page || 0,
    pageSize = req.query.pageSize || perPage;
    Property.find(query)
        .limit(pageSize)
        .skip(pageSize * page)
        .sort({
            name: 'asc'
        }).exec(function(err, projects) {
            if (err) {
                utils.handleError(res, null, err)
            }
            res.status(200).json(projects);
        });

};
