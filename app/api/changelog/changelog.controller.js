'use strict';

var Changelog = require('./changelog.model.js'),
    async = require('async');

var perPage = 20;

/**
 * Get public Changelog list
 */
exports.get = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {},
        page = req.query.page || 0,
        pageSize = req.query.pageSize || perPage;

    Changelog.find(query)
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize * page))
        .sort({
            order: 'asc'
        }).exec(function(err, projects) {
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
    Changelog.create(req.body, function(err) {
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
    Changelog.find({})
        .exec(function(err, changelog) {
            if (err) {
                console.log(err);
                err.code = parseInt(err.code) || 500;
                res.status(err.code).send(err);
            } else {
                async.map(changelog, function(item, callBack) {
                    item.delete(callBack);
                }, function() {
                    res.sendStatus(200);
                });
            }
        });
};
