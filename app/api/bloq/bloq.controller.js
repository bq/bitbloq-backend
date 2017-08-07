'use strict';

var Bloq = require('./bloq.model.js'),
    utils = require('../utils'),
    async = require('async');

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
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            res.status(200).json(projects);
        }
    });

};

exports.createAll = function(req, res) {
    Bloq.create(req.body, function(err) {
        if (err) {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.deleteAll = function(req, res) {
    Bloq.find({})
        .exec(function(err, bloqs) {
            if (err) {
                console.log(err);
                err.code = utils.getValidHttpErrorCode(err);
                res.status(err.code).send(err);
            } else {
                async.map(bloqs, function(bloq, callBack) {
                    bloq.delete(callBack);
                }, function() {
                    res.sendStatus(200);
                });
            }
        });
};
