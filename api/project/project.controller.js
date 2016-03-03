'use strict';

var Project = require('./project.model');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}


/**
 * Get list of project
 */
exports.getAll = function(req, res) {
  Project.find({})
    .then(function(projects) {
      res.status(200).json(projects);
    })
    .catch(function(){
      handleError(res)
    });
};


/**
* Creates a new project
*/
exports.create = function(req, res) {
  var newProject = new Project(req.body);
  newProject.saveAsync().then(function (project) {
    return res.json(project);
  }).catch(validationError(res));
};

/**
* Get a single project
*/
exports.show = function(req, res, next) {
  var projectId = req.params.id;
  Project.findById(projectId)
    .then(function(project) {
      if (!project) {
        return res.status(404).end();
      }
      res.json(project);
    })
    .catch(function(err) {
      return next(err);
    });
};


/**
* Deletes a Project
*/
exports.destroy = function(req, res) {
  Project.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};




/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};
