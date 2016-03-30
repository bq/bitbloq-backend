'use strict';

var Project = require('./project.model'),
    UserFunctions = require('../user/user.functions'),
    utils = require('../utils'),
    Promise = require('bluebird');

var perPage = 20;

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
    query = utils.extend(query, {
        '_acl.ALL.permission': 'READ'
    });
    Project.count(query).then(function(counter) {
        res.status(200).json({
            'count': counter
        });
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
    var query = params.query ? JSON.parse(params.query) : {};
    query = utils.extend(query, {
        '_acl.ALL.permission': 'READ'
    });
    var page = params.page || 0;
    Project.find(query)
        .limit(perPage)
        .skip(perPage * page)
        .sort({
            name: 'asc'
        }).exec(function(err, projects) {
            if (err) {
                utils.handleError(res, null, err)
            }
            completeProjects(res, projects)
        });
}

function isOwner(userId, project) {
    var owner = false;
    if (project._acl['user:' + userId].permission === 'ADMIN') {
        owner = true;
    }
    return owner;
}

/**
 * Create a new project
 */
exports.create = function(req, res) {

    // Was an image uploaded? If so, we'll use its public URL
    // in cloud storage.
    if (req.file && req.file.cloudStoragePublicUrl) {
        req.body.imageUrl = req.file.cloudStoragePublicUrl;
    }

    var projectObject = clearProject(req.body);
    projectObject.creatorId = req.user._id;
    var newProject = new Project(projectObject);
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

            if (project._acl.ALL && project._acl.ALL.permission === 'READ') {
                //it is public
                if (req.query && req.query.profile) {
                    res.json(project.profile);
                } else {
                    project.addView();
                    updateProject(projectId, project);
                    res.status(200).json(project);
                }
            } else if (req.user && project._acl['user:' + req.user._id] && (project._acl['user:' + req.user._id].permission === 'READ' || project._acl['user:' + req.user._id].permission === 'ADMIN')) {
                //it is a shared project
                if (req.query && req.query.profile) {
                    res.json(project.profile);
                } else {
                    res.status(200).json(project);
                }
            } else {
                //it is a private project
                utils.handleError(res, 401, {
                    'error': 'unauthorized',
                    'errorDescription': 'This project is unauthorized to show with current user'
                });
            }
        })
        .catch(utils.handleError(res, 404));
};

/**
 * Get public project list
 */
exports.getAll = function(req, res) {
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
 * Get my projects
 */
exports.me = function(req, res) {
    var userId = req.user._id,
        query = {},
        page = req.query.page || 0,
        pageSize = req.query.pageSize || perPage;
    query['_acl.user:' + userId + '.permission'] = 'ADMIN';
    Project.find(query)
        .limit(pageSize)
        .skip(pageSize * page)
        .sort({
            name: 'asc'
        }).then(function(projects) {
            res.status(200).json(projects);
        })
        .catch(utils.handleError(res));
};

/**
 * Get project shared with me
 */
exports.sharedWithMe = function(req, res) {
    var userId = req.user._id,
        query = {},
        page = req.query.page || 0,
        pageSize = req.query.pageSize || perPage;
    query['_acl.user:' + userId + '.permission'] = 'READ';
    Project.find(query)
        .limit(pageSize)
        .skip(pageSize * page)
        .sort({
            name: 'asc'
        }).then(function(projects) {
            res.status(200).json(projects);
        })
        .catch(utils.handleError(res));
};

/**
 * Update my project
 */
exports.update = function(req, res) {
    var projectId = req.params.id;
    if (isOwner(req.user._id, req.body)) {
        var projectObject = clearProject(req.body);
        updateProject(projectId, projectObject, res);
    } else {
        utils.handleError(res, 401, {
            'error': 'unauthorized',
            'errorDescription': 'This project is unauthorized to update with current user'
        });
    }
};

/**
 * Publish my project
 */
exports.publish = function(req, res) {
    var projectId = req.params.id,
        userId = req.user._id;
    Project.findByIdAsync(projectId).then(function(project) {
        if (project.isOwner(userId)) {
            project.setPublic();
            updateProject(projectId, project, res);
        } else {
            utils.handleError(res, 401, {
                'error': 'unauthorized',
                'errorDescription': 'This project is unauthorized to publish with current user'
            });
        }
    }, utils.handleError(res));
};

/**
 * Privatize my project
 */
exports.private = function(req, res) {
    var projectId = req.params.id,
        userId = req.user._id;
    Project.findByIdAsync(projectId).then(function(project) {
        if (project.isOwner(userId)) {
            project.setPrivate();
            updateProject(projectId, project, res);
        } else {
            utils.handleError(res, 401, {
                'error': 'unauthorized',
                'errorDescription': 'This project is unauthorized to publish with current user'
            });
        }
    }, utils.handleError(res));
};

/**
 * Share my project with other users
 */
exports.share = function(req, res) {
    var projectId = req.params.id,
        emails = req.body,
        response = {
            noUsers: [],
            users: []
        },
        userId = req.user._id;
    Project.findByIdAsync(projectId).then(function(project) {
        if (project.isOwner(userId)) {
            project.resetShare();
            Promise.map(emails, function(email) {
                return new Promise(function(resolve, reject) {
                    UserFunctions.getUserId(email).then(function(userId) {
                        project.share({
                            id: userId,
                            email: email
                        });
                        response.users.push(email);
                        resolve();
                    }).catch(function() {
                        response.noUsers.push(email);
                        resolve();
                    });
                });
            }).then(function() {
                updateProject(projectId, project);
                res.status(200).json({
                    users: response.users,
                    noUsers: response.noUsers
                })
            }).catch(utils.handleError(res));
        } else {
            utils.handleError(res, 401, {
                'error': 'unauthorized',
                'errorDescription': 'This project is unauthorized to publish with current user'
            });
        }
    }).catch(utils.handleError(res));
};

/**
 * Deletes a Project
 */
exports.destroy = function(req, res) {
    var userId = req.user._id,
        projectId = req.params.id;
    Project.findByIdAsync(projectId).then(function(project) {
        if (project.isOwner(userId)) {
            Project.findByIdAndRemoveAsync(projectId)
                .then(function() {
                    res.status(204).end();
                })
                .catch(utils.handleError(res));
        } else {
            utils.handleError(res, 401, {
                'error': 'unauthorized',
                'errorDescription': 'This project is unauthorized to delete with current user'
            });
        }
    }).catch(utils.handleError(res));
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};