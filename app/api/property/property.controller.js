'use strict';

var Property = require('./property.model.js'),
    async = require('async');

var perPage = 20;

/**
 * Get public property list
 */
exports.getAll = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {},
        page = req.query.page || 0,
        pageSize = req.query.pageSize || perPage;
    Property.find(query)
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize * page))
        .sort({
            name: 'asc'
        })
        .exec(function(err, projects) {
            if (err) {
                console.log(err);
                err.code = parseInt(err.code) || 500;
                res.status(err.code).send(err);
            } else {
                res.status(200).json(projects);
            }
        });
};

exports.createAll = function(req, res) {
    Property.create(req.body, function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.deleteAll = function(req, res) {
    Property.find({})
        .exec(function(err, properties) {
            if (err) {
                console.log(err);
                err.code = parseInt(err.code) || 500;
                res.status(err.code).send(err);
            } else {
                async.map(properties, function(property, callBack) {
                    property.delete(callBack);
                }, function(err) {
                    res.sendStatus(200);
                });
            }
        });
};
