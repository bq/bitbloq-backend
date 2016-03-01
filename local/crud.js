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

module.exports = function(model, images, oauth2) {

  var router = express.Router();

  // Use the oauth middleware to automatically get the user's profile
  // information and expose login/logout URLs to templates.
  router.use(oauth2.aware);
  router.use(oauth2.template);

  // Set Content-Type for all responses for these routes
  router.use(function(req, res, next) {
    res.set('Content-Type', 'text/html');
    next();
  });

  /**
   * GET /projects/add
   *
   * Display a page of projects (up to ten at a time).
   */
  router.get('/', function list(req, res, next) {
    model.list(10, req.query.pageToken, function(err, entities, cursor) {
      if (err) {
        return next(err);
      }
      res.render('projects/list.jade', {
        projects: entities,
        nextPageToken: cursor
      });
    });
  });

  // Use the oauth2.required middleware to ensure that only logged-in users
  // can access this handler.
  router.get('/mine', oauth2.required, function list(req, res, next) {
    model.listBy(
      req.session.profile.id,
      10,
      req.query.pageToken,
      function(err, entities, cursor, apiResponse) {
        console.log(err, apiResponse);
        if (err) {
          return next(err);
        }
        res.render('projects/list.jade', {
          projects: entities,
          nextPageToken: cursor
        });
      }
    );
  });

  /**
   * GET /projects/add
   *
   * Display a form for creating a project.
   */
  router.get('/add', function addForm(req, res) {
    res.render('projects/form.jade', {
      project: {},
      action: 'Add'
    });
  });

  /**
   * POST /projects/add
   *
   * Create a project.
   */
    // [START add]
  router.post(
    '/add',
    images.multer.single('image'),
    images.sendUploadToGCS,
    function insert(req, res, next) {
      var data = req.body;

      // If the user is logged in, set them as the creator of the project.
      if (req.session.profile) {
        data.createdBy = req.session.profile.displayName;
        data.createdById = req.session.profile.id;
      } else {
        data.createdBy = 'Anonymous';
      }

      // Was an image uploaded? If so, we'll use its public URL
      // in cloud storage.
      if (req.file && req.file.cloudStoragePublicUrl) {
        data.imageUrl = req.file.cloudStoragePublicUrl;
      }

      // Save the data to the database.
      model.create(data, function(err, savedData) {
        if (err) {
          return next(err);
        }
        res.redirect(req.baseUrl + '/' + savedData.id);
      });
    }
  );
  // [END add]

  /**
   * GET /projects/:id/edit
   *
   * Display a project for editing.
   */
  router.get('/:project/edit', function editForm(req, res, next) {
    model.read(req.params.project, function(err, entity) {
      if (err) {
        return next(err);
      }
      res.render('projects/form.jade', {
        project: entity,
        action: 'Edit'
      });
    });
  });

  /**
   * POST /projects/:id/edit
   *
   * Update a project.
   */
  router.post(
    '/:project/edit',
    images.multer.single('image'),
    images.sendUploadToGCS,
    function update(req, res, next) {
      var data = req.body;

      // Was an image uploaded? If so, we'll use its public URL
      // in cloud storage.
      if (req.file && req.file.cloudStoragePublicUrl) {
        req.body.imageUrl = req.file.cloudStoragePublicUrl;
      }

      model.update(req.params.project, data, function(err, savedData) {
        if (err) {
          return next(err);
        }
        res.redirect(req.baseUrl + '/' + savedData.id);
      });
    }
  );

  /**
   * GET /projects/:id
   *
   * Display a project.
   */
  router.get('/:project', function get(req, res, next) {
    model.read(req.params.project, function(err, entity) {
      if (err) {
        return next(err);
      }
      res.render('projects/view.jade', {
        project: entity
      });
    });
  });

  /**
   * GET /projects/:id/delete
   *
   * Delete a project.
   */
  router.get('/:project/delete', function _delete(req, res, next) {
    model.delete(req.params.project, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect(req.baseUrl);
    });
  });

  /**
   * Errors on "/projects/*" routes.
   */
  router.use(function handleRpcError(err, req, res, next) {
    // Format error and forward to generic error handler for logging and
    // responding to the request
    err.response = err.message;
    next(err);
  });

  return router;
};
