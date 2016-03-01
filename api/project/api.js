// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(model) {

  var router = express.Router();

  // Automatically parse request body as JSON
  router.use(bodyParser.json());

  /**
   * GET /api/project
   *
   * Retrieve a page of project (up to ten at a time).
   */
  router.get('/', function list(req, res, next) {
    model.list(10, req.query.pageToken, function(err, entities, cursor) {
      if (err) {
        return next(err);
      }
      res.json({
        items: entities,
        nextPageToken: cursor
      });
    });
  });

  /**
   * POST /api/project
   *
   * Create a new project.
   */
  router.post('/', function insert(req, res, next) {
    model.create(req.body, function(err, entity) {
      if (err) {
        return next(err);
      }
      res.json(entity);
    });
  });

  /**
   * GET /api/project/:id
   *
   * Retrieve a project.
   */
  router.get('/:project', function get(req, res, next) {
    model.read(req.params.project, function(err, entity) {
      if (err) {
        return next(err);
      }
      res.json(entity);
    });
  });

  /**
   * PUT /api/project/:id
   *
   * Update a project.
   */
  router.put('/:project', function update(req, res, next) {
    model.update(req.params.project, req.body, function(err, entity) {
      if (err) {
        return next(err);
      }
      res.json(entity);
    });
  });

  /**
   * DELETE /api/project/:id
   *
   * Delete a project.
   */
  router.delete('/:project', function _delete(req, res, next) {
    model.delete(req.params.project, function(err) {
      if (err) {
        return next(err);
      }
      res.status(200).send('OK');
    });
  });

  /**
   * Errors on "/api/project/*" routes.
   */
  router.use(function handleRpcError(err, req, res, next) {
    // Format error and forward to generic error handler for logging and
    // responding to the request
    err.response = {
      message: err.message,
      internalCode: err.code
    };
    next(err);
  });

  return router;
};
