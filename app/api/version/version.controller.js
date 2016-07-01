'use strict';

var Version = require('./version.model.js');

var perPage = 20;

/**
 * Get public version
 */
exports.getAll = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {},
        page = req.query.page || 0,
        pageSize = req.query.pageSize || perPage;
    Version.find(query)
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize * page))
        .sort({
            _updateAt: 'asc'
        })
        .exec(function(err, projects) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(projects);
            }
        });
};

exports.createAll = function(req, res) {
    Version.create(req.body, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.deleteAll = function(req, res) {
    Version.remove({}, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};
