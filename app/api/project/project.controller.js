'use strict';

var Project = require('./project.model.js'),
    UserFunctions = require('../user/user.functions.js'),
    utils = require('../utils'),
    async = require('async'),
    _ = require('lodash');

var maxPerPage = 20;

function updateProject(projectId, dataProject, res) {

    Project.findById(projectId, function(err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            doc = _.extend(doc, dataProject);
            doc.save(function(err, finalDoc) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
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
    Project.count(query, function(err, counter) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json({
                'count': counter
            });
        }
    });
}

function getUserProject(item, next) {
    var project = JSON.parse(JSON.stringify(item));
    UserFunctions.getUserProfile(project.creatorId, function(err, user) {
        if (user) {
            project.creatorUsername = user.username;
        }
        next(err, project);
    });
}

function completeProjects(res, projects) {
    async.map(projects, getUserProject, function(err, completedProjects) {
        if (err) {
            res.status(500).send(err)
        } else {

            res.status(200).json(completedProjects);
        }
    });
}

function getSearch(res, params) {
    var query = params.query ? JSON.parse(params.query) : {},
        page = params.page || 0,
        perPage = (query.perPage && (query.perPage <= maxPerPage)) ? query.perPage : maxPerPage,
        defaultSortFilter = {
            name: 'desc'
        },
        sortFilter;
    if (params.sort) {
        sortFilter = JSON.parse(params.sort) || defaultSortFilter;
    } else {
        sortFilter = defaultSortFilter;
    }

    query = utils.extend(query, {
        '_acl.ALL.permission': 'READ'
    });

    Project.find(query)
        .limit(parseInt(perPage))
        .skip(parseInt(perPage * page))
        .sort(sortFilter)
        .exec(function(err, projects) {
            if (err) {
                res.status(500).send(err);
                console.log('Error');
            } else {
                completeProjects(res, projects)
            }
        });
}

/**
 * Create a new project
 */
exports.create = function(req, res) {
    var projectObject = clearProject(req.body);
    projectObject.creatorId = req.user._id;
    var newProject = new Project(projectObject);
    newProject.save(function(err, project) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(project.id);
        }
    });
};

/**
 * Get a single project
 */
exports.show = function(req, res) {
    var projectId = req.params.id;
    Project.findById(projectId, function(err, project) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!project) {
                res.sendStatus(404);
            } else {
                if (project._acl.ALL && project._acl.ALL.permission === 'READ') {
                    //it is public
                    if (req.query && req.query.profile) {
                        res.status(200).json(project.profile);
                    } else {
                        project.addView();
                        Project.findByIdAndUpdate(projectId, project, function(err, project) {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.status(200).json(project);
                            }
                        });
                    }
                } else if (req.user && project._acl['user:' + req.user._id] && (project._acl['user:' + req.user._id].permission === 'READ' || project._acl['user:' + req.user._id].permission === 'ADMIN')) {
                    //it is a shared project
                    if (req.query && req.query.profile) {
                        res.status(200).json(project.profile);
                    } else {
                        res.status(200).json(project);
                    }
                } else {
                    //it is a private project
                    res.sendStatus(401);
                }
            }
        }
    });
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
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize * page))
        .sort({
            name: 'asc'
        })
        .exec(function(err, projects) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(projects);
            }
        });
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
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize * page))
        .sort({
            name: 'asc'
        })
        .exec(function(err, projects) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(projects);
            }
        });
};

/**
 * Update my project
 */
exports.update = function(req, res) {
    var projectId = req.params.id;
    Project.findById(projectId, function(err, project) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (project.isOwner(req.user._id)) {
                var projectObject = clearProject(req.body);
                updateProject(projectId, projectObject, res);
            } else {
                res.sendStatus(401);
            }
        }
    });
};

/**
 * Publish my project
 */
exports.publish = function(req, res) {
    var projectId = req.params.id,
        userId = req.user._id;
    Project.findById(projectId, function(err, project) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (project.isOwner(userId)) {
                Project.findByIdAndUpdate(projectId, {
                    '_acl.ALL': {
                        permission: 'READ',
                        properties: {
                            date: new Date()
                        }
                    }
                }, function(err) {
                    if (err) {
                        res.sendStatus(500).send(err);
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.sendStatus(401);
            }
        }
    });
};

/**
 * Privatize my project
 */
exports.private = function(req, res) {
    var projectId = req.params.id,
        userId = req.user._id;
    Project.findById(projectId, function(err, project) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (project.isOwner(userId)) {
                Project.findByIdAndUpdate(projectId, {
                    $unset: {
                        '_acl.ALL': 1
                    }
                }, function(err) {
                    if (err) {
                        res.sendStatus(500).send(err);
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.sendStatus(401);
            }
        }
    });
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
    Project.findById(projectId, function(err, project) {
        if (err) {
            res.status(500).send(err)
        } else {
            if (project.isOwner(userId)) {
                project.resetShare();
                async.map(emails, function(email, done) {
                        if (email === req.user.email) {
                            done();
                        } else {
                            UserFunctions.getUserId(email, function(err, user) {
                                if (user) {
                                    project.share({
                                        id: user,
                                        email: email
                                    });
                                    response.users.push(email);
                                } else if (!err) {
                                    response.noUsers.push(email);
                                }
                                done(err);
                            });
                        }
                    },
                    function(err) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            Project.findByIdAndUpdate(projectId, project, function(err) {
                                if (err) {
                                    res.status(500).send(err);
                                } else {
                                    res.status(200).json(response);
                                }
                            });
                        }
                    });
            } else {
                res.sendStatus(401);
            }
        }
    });
};

/**
 * Deletes a Project
 */
exports.destroy = function(req, res) {
    var userId = req.user._id,
        projectId = req.params.id;
    Project.findById(projectId, function(err, project) {
        if (err) {
            res.status(500).send(err)
        } else if (project) {
            if (project.isOwner(userId)) {
                Project.findByIdAndRemove(projectId, function(err) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.status(204).end();
                    }
                });
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(404);
        }
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};