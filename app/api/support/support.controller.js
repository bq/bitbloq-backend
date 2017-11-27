'use strict';

var Support = require('./support.model.js'),
    utils = require('../utils');

// GET
exports.getAll = function(req, res) {
    Support.find(
      {},
      function(err, docs) {
        if (!err) {
            res.status(200).send(docs);
        } else {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        }
      });
};
exports.show = function(req, res) {
    Support.find(
      { _id: req.params.id },
      function(err, doc) {
        if (!err) {
            res.status(doc.length ? 200 : 404).send(doc);
        } else {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        }
      });
};
exports.showPermalink = function(req, res) {
    Support.find(
      { permalink: req.params.id },
      function(err, doc) {
        if (!err) {
            res.status(doc.length ? 200 : 404).send(doc);
        } else {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        }
      });
};

// POST
exports.create = function(req, res) {
    var card = new Support(req.body);
    card.save(
      function(err, doc) {
        if (!err) {
            res.status(201).send(doc);
        } else {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        }
      });
};

// PUT
exports.update = function(req, res) {
    delete req.body._id;
    Support.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      function(err, doc) {
        if (!err) {
            res.status(doc ? 200 : 404).send(doc);
        } else {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        }
      });
};
exports.updatePermalink = function(req, res) {
    delete req.body._id;
    console.log(req.params.id);
    Support.findOneAndUpdate(
      { permalink: req.params.id },
      req.body,
      { new: true },
      function(err, doc) {
        if (!err) {
            res.status(doc ? 200 : 404).send(doc);
        } else {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        }
      });
};

// DELETE
exports.destroy = function(req, res) {
    Support.findOneAndRemove(
      { _id: req.params.id },
      function(err, doc) {
        if (!err) {
            res.status(doc ? 204 : 404).end();
        } else {
            console.log(err);
            err.code = utils.getValidHttpErrorCode(err);
            res.status(err.code).send(err);
        }
      });
};
