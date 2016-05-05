'use strict';

var Bloq = require('./bloq.model'),
    utils = require('../utils');

var perPage = 20;

/**
 * Get public bloq list
 */
exports.get = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {},
        page = req.query.page || 0,
        pageSize = req.query.pageSize || perPage;

    Bloq.find(query)
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize * page))
        .sort({
            name: 'asc'
        }).exec(function(err, projects) {
            if (err) {
                utils.handleError(res, null, err)
            }
            res.status(200).json(projects);
        });

};

exports.createAll = function(req, res) {
    Bloq.collection.insert(req.body, function(err) {
        if (err) {
            utils.handleError(res, null, err)
        } else {
            res.sendStatus(200);
        }
    });
};

exports.deleteAll = function(req, res) {
    Bloq.remove({}, function(err) {
        if (err) {
            utils.handleError(res, null, err)
        } else {
            res.sendStatus(200);
        }
    });
};