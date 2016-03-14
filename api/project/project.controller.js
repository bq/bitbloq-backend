'use strict';

var Project = require('./project.model'),
    UserFunctions = require('../user/user.functions'),
    utils = require('../utils'),
    Promise = require('bluebird');

var perPage = 2;

function updateProject(projectId, dataProject, res) {
    Project.findByIdAndUpdateAsync(projectId, dataProject).then(function() {
        if (res) {
            res.sendStatus(200);
        }
    }).catch(utils.validationError(res));
}

function clearProject(project) {
    delete project._id;
    delete project.timesViewed;
    delete project.timesAdded;
    delete project._acl;
    return project;
}


function getCountPublic(res, params) {
    var query = params.query ? JSON.parse(params.query) : {};
    query = utils.extend(query, {'_acl.ALL.permission': 'READ'});
    Project.count(query).then(function(counter) {
        res.status(200).json({'count': counter});
    }).catch(utils.handleError(res));
}


function completeProjects(res, projects) {
    var projectResult = [];
    Promise.map(projects, function(item) {
        var project = JSON.parse(JSON.stringify(item));
        return new Promise(function(resolve, reject) {
            UserFunctions.getUserProfile(project.creatorId).then(function(user) {
                project.creatorUsername = user.username;
                projectResult.push(project);
                resolve();
            }).catch(function() {
                projectResult.push(project);
                resolve();
            });
        });
    }).then(function() {
        res.status(200).json(projectResult);
    }).catch(utils.handleError(res));
}


function getSearch(res, params) {
    var query = params.query? JSON.parse(params.query) : {};
    query = utils.extend(query, {'_acl.ALL.permission': 'READ'});
    var page = params.page || 0;
    console.log(query);
    console.log(page);
    Project.find(query).limit(perPage)
        .skip(perPage * page)
        .sort({
            name: 'asc'
        }).exec(function(err, projects) {
            console.log('THEN');
            if (err) {
                utils.handleError(res, err)
            }
            completeProjects(res, projects)
        });
}


/**
 * Create a new project
 */
exports.create = function(req, res) {
    var projectObject = clearProject(req.body);
    var newProject = new Project(req.body);
    newProject.saveAsync().then(function(project) {
        return res.json(project.id);
    }).catch(utils.validationError(res));
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
            if (req.query && req.query.profile) {
                res.json(project.profile);
            } else {
                //if(no eres el user ni estas en el acl){
                project.addView();
                updateProject(projectId, project);
                //}
                res.status(200).json(project);
            }
        })
        .catch(function(err) {
            return next(err);
        });
};


/**
 * Get public project list
 */
exports.getAll = function(req, res) {
    console.log(req.query);
    if (req.query && !utils.isEmpty(req.query)) {
        if (req.query.count === '*') {
            getCountPublic(res, req.query);
        } else if (req.query.query) {
            getSearch(res, req.query);
        } else {
            getSearch(res, req.query);
        }
    } else {
        getSearch(res);
    }
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
        .catch(utils.handleError(res));
};


/**
 * Update my project
 */
exports.update = function(req, res) {
    var projectId = req.params.id;
    var projectObject = clearProject(req.body);
    updateProject(projectId, projectObject, res);
};


/**
 * Publish my project
 */
exports.publish = function(req, res) {
    var projectId = req.params.id;
    Project.findByIdAsync(projectId).then(function(project) {
        project.setPublic();
        updateProject(projectId, project, res);
    }, utils.handleError(res));
};


/**
 * Privatize my project
 */
exports.private = function(req, res) {
    var projectId = req.params.id;
    Project.findByIdAsync(projectId).then(function(project) {
        project.setPrivate();
        updateProject(projectId, project, res);
    }, utils.handleError(res));
};


/**
 * Share my project with other users
 */
exports.share = function(req, res) {
    var projectId = req.params.id;
    var emails = req.body.emails;
    var noUsers = [];
    Project.findByIdAsync(projectId).then(function(project) {
        Promise.map(emails, function(email) {
            return new Promise(function(resolve, reject) {
                UserFunctions.getUserId(email).then(function(userId) {
                    project.share({id: userId, email: email});
                    resolve();
                }).catch(function() {
                    noUsers.push(email);
                    resolve();
                });
            });
        }).then(function() {
            updateProject(projectId, project);
            res.status(200).json({noUsers: noUsers})
        }).catch(utils.handleError(res));
    }).catch(utils.handleError(res));
};


/**
 * Deletes a Project
 */
exports.destroy = function(req, res) {
    Project.findByIdAndRemoveAsync(req.params.id)
        .then(function() {
            res.status(204).end();
        })
        .catch(utils.handleError(res));
};


/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};
