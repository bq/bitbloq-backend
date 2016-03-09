'use strict';

var Project = require('./project.model'),
    UserController = require('./../user/user.controller'),
    config = require('../../config/environment'),
    Promise = require('bluebird');

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

function updateProject(projectId, dataProject) {
    Project.findByIdAndUpdateAsync(projectId, dataProject).then(function() {
        res.sendStatus(200);
    }, function(err) {
        handleError(err);
    });
}
/**
 * Creates a new project
 */
exports.create = function(req, res) {
    var newProject = new Project(req.body);
    newProject.saveAsync().then(function(project) {
        return res.json(project.id);
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
 * Get public project list
 */
exports.getAll = function(req, res) {
    Project.find({
        '_acl.ALL.permission': 'READ'
    }).then(function(projects) {
        var projectResult = [];

        Promise.map(projects, function(item) {
            var project = JSON.parse(JSON.stringify(item));
            var deferred = Promise.defer();
            UserController.getUserProfile(project.creatorId).then(function(user) {
                project.creatorUsername = user.username;
                projectResult.push(project);
                deferred.resolve();
            }).catch(function() {
                projectResult.push(project);
                deferred.resolve();
            });
            return deferred.promise;
        }).then(function() {
            return res.status(200).json(projectResult);
        }).catch(function(err) {
            return handleError(res)
        });

    }).catch(function() {
        return handleError(res)
    });
};


/**
 * Get my info
 */
exports.me = function(req, res, next) {
    var userId = req.user._id,
        query = {};
    query['_acl.user:' + userId + '.permission'] = 'ADMIN';
    Project.find(query)
        .then(function(projects) {
            res.status(200).json(projects);
        })
        .catch(function() {
            handleError(res)
        });
};


/**
 * Update my project
 */
exports.update = function(req, res) {
    var projectId = req.params.id;
    updateProject(projectId, req.body.project);
};


/**
 * Publish my project
 */
exports.publish = function(req, res) {
    var projectId = req.params.id;
    Project.findByIdAsync(projectId).then(function(project) {
        project.setPublic();
        updateProject(projectId, project);
    }, function(err) {
        handleError(err);
    });
};


/**
 * Privatize my project
 */
exports.private = function(req, res) {
    var projectId = req.params.id;
    Project.findByIdAsync(projectId).then(function(project) {
        project.setPrivate();
        updateProject(projectId, project);
    }, function(err) {
        handleError(err);
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
