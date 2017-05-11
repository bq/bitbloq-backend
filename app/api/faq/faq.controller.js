'use strict';

var Faq = require('./faq.model.js'),
    async = require('async');

var perPage = 20;

/**
 * Get public Faq list
 */
exports.get = function(req, res) {
    var query = req.query.query ? JSON.parse(req.query.query) : {},
        page = req.query.page || 0,
        pageSize = req.query.pageSize || perPage;

    Faq.find(query)
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize * page))
        .sort({
            name: 'asc'
        }).exec(function(err, projects) {
        if (err) {
            console.log(err);
            err.code = err.code.match(/[1-5][0-5][0-9]/g) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).json(projects);
        }
    });

};

exports.createAll = function(req, res) {
    Faq.create(req.body, function(err) {
        if (err) {
            console.log(err);
            err.code = err.code.match(/[1-5][0-5][0-9]/g) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.deleteAll = function(req, res) {
    Faq.find({})
        .exec(function(err, faqs) {
            if (err) {
                console.log(err);
                err.code = err.code.match(/[1-5][0-5][0-9]/g) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                async.map(faqs, function(faq, callBack) {
                    faq.delete(callBack);
                }, function() {
                    res.sendStatus(200);
                });
            }
        });
};
