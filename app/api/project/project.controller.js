'use strict';

var Project = require('./project.model.js'),
    UserFunctions = require('../user/user.functions.js'),
    ImageFunctions = require('../image/image.functions.js'),
    utils = require('../utils'),
    async = require('async'),
    config = require('../../res/config.js'),
    mailer = require('../../components/mailer'),
    ObjectID = require('mongoose').Types.ObjectId,
    _ = require('lodash');

var maxPerPage = 20;

function clearProject(project) {
    delete project._id;
    delete project.timesViewed;
    delete project.timesAdded;
    delete project._acl;
    delete project.__v;
    if (project.hardware.components) {
        for (var i = 0; i < project.hardware.components.length; i++) {
            delete project.hardware.components[i].$$hashKey;
        }
    }
    return project;
}

function getCountPublic(res, query) {
    Project.count(query, function(err, counter) {
        if (err) {
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).json({
                'count': counter
            });
        }
    });
}

function completeQuery(params, next) {
    var query = params.query ? JSON.parse(params.query) : {};
    query = utils.extend(query, {
        '_acl.ALL.permission': 'READ'
    });

    var queryUser = _.find(query.$or, 'creator');

    if (queryUser) {
        UserFunctions.getUserIdsByName(queryUser.creator, function(err, users) {
            if (users) {
                var userIds = _.map(users, '_id');
                query.$or[1].creator = {
                    $in: userIds
                };
            }
            next(err, query);
        })
    } else {
        next(null, query);
    }

}

function getSearch(res, params) {
    var page = params.page || 0,
        perPage = (params.pageSize && (params.pageSize <= maxPerPage)) ? params.pageSize : maxPerPage,
        defaultSortFilter = {
            updatedAt: 'desc'
        },
        sortFilter = params.sort ? JSON.parse(params.sort) : defaultSortFilter;

    Project.find(params.query)
        .select('_id name creator timesViewed timesAdded codeProject')
        .limit(parseInt(perPage))
        .skip(parseInt(perPage * page))
        .sort(sortFilter)
        .populate('creator', 'username')
        .exec(function(err, projects) {
            if (err) {
                console.log(err);
                err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                res.status(200).json(projects);
            }
        });
}

function updateProjectAndReturn(res, project) {
    Project.findByIdAndUpdate(project.id, project)
        .populate('creator', 'username')
        .exec(function(err, completedProject) {
            if (err) {
                console.log(err);
                err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                res.status(200).json(completedProject);
            }

        });
}

function returnProject(req, res, project) {
    if (project._acl.ALL && project._acl.ALL.permission === 'READ') {
        //it is public
        if (req.query && req.query.profile) {
            res.status(200).json(project.profile);
        } else if (req.user && !project._acl['user:' + req.user._id]) {
            project.addView();
            updateProjectAndReturn(res, project);
        } else {
            res.status(200).json(project);
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

/**
 * Create a new project
 */
exports.create = function(req, res) {
    var projectObject = clearProject(req.body);
    projectObject.creator = req.user._id;
    var newProject = new Project(projectObject);
    newProject.save(function(err, project) {
        if (err) {
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).json(project.id);
        }
    });
};

/**
 * Download a project (download times are incremented
 */
exports.download = function(req, res) {
    Project.findById(req.params.id, function(err, project) {
        if (req.user || project._acl.ALL) {
            if (req.user && !project._acl['user:' + req.user._id]) {
                project.addDownload();
                project.update(project, function(err) {
                    if (err) {
                        console.log(err);
                        err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                        res.status(err.code).send(err);
                    } else {
                        res.status(200).json(project);
                    }
                });
            } else {
                res.status(200).json(project);
            }
        } else {
            res.sendStatus(401);
        }
    });
};

/**
 * Get a single project
 */
exports.show = function(req, res) {
    var query;
    if (ObjectID.isValid(req.params.id)) {
        query = {
            _id: new ObjectID(req.params.id)
        };
    } else {
        query = {
            corbelId: req.params.id
        };
    }
    Project.findOne(query)
        .populate('creator', 'username')
        .exec(function(err, project) {
            if (err) {
                console.log(err);
                err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else if (!project) {
                res.sendStatus(404);
            } else {
                returnProject(req, res, project);
            }
        });
};

/**
 * Get public project list
 */
exports.getPublished = function(req, res) {
    if (req.query && !utils.isEmpty(req.query)) {
        completeQuery(req.query, function(err, query) {
            if (err) {
                console.log(err);
                err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                if (req.query.count === '*') {
                    getCountPublic(res, query);
                } else {
                    req.query.query = query;
                    getSearch(res, req.query)
                }
            }
        });
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
        pageSize = req.query.pageSize || maxPerPage,
        sortParams = {};
    query['_acl.user:' + userId + '.permission'] = 'ADMIN';

    if (req.query.query) {
        utils.extend(query, JSON.parse(req.query.query));
    }

    if (req.query.updatedAt) {
        sortParams.updatedAt = req.query.updatedAt;
    }

    if (req.query.name) {
        sortParams.name = req.query.name;
    }

    console.log('sortParams');
    console.log(sortParams);
    Project.find(query)
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize * page))
        .sort(sortParams)
        .exec(function(err, projects) {
            if (err) {
                console.log(err);
                err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                if (req.query.count === '*') {
                    console.log('por aqui');
                    getCountPublic(res, query);
                } else {
                    console.log('por alla');
                    res.status(200).json(projects);
                }
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
        .populate('creator', 'username')
        .exec(function(err, projects) {
            if (err) {
                console.log(err);
                err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
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
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            if (project && project.isOwner(req.user._id)) {
                var projectBody = clearProject(req.body);
                project = _.extend(project, projectBody);
                try {
                    project.save(function(err) {
                        if (err) {
                            console.log(err);
                            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                            res.status(err.code).send(err);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                } catch (err) {
                    res.sendStatus(500);
                }
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
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
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

                        console.log(err);
                        res.sendStatus(err.code).send(err);
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
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            if (project.isOwner(userId)) {
                Project.findByIdAndUpdate(projectId, {
                    $unset: {
                        '_acl.ALL': 1
                    }
                }, function(err) {
                    if (err) {
                        console.log(err);
                        err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                        res.status(err.code).send(err);
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
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err)
        } else {
            if (project.isOwner(userId)) {
                project.resetShare();
                async.map(emails, function(email, done) {
                        email = email.toLowerCase();
                        if (email === req.user.email) {
                            done();
                        } else {
                            UserFunctions.getUserId(email, function(err, user) {
                                if (user) {
                                    project.share({
                                        id: user,
                                        email: email
                                    });

                                    var locals = {
                                        email: email,
                                        subject: req.user.username + ' ha compartido contigo un proyecto de Bitbloq',
                                        username: req.user.username
                                    };

                                    if (project.codeproject) {
                                        locals.projectUrl = config.client_domain + '#/login?init=/codeproject/' + projectId;
                                    } else {
                                        locals.projectUrl = config.client_domain + '#/login?init=/bloqsproject/' + projectId;
                                    }

                                    mailer.sendOne('shareProject', locals, function(err) {
                                        if (err) {
                                            console.log(err);
                                            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                                            res.status(err.code).send(err);
                                        } else {
                                            res.status(200);
                                        }
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
                            console.log(err);
                            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                            res.status(err.code).send(err);
                        } else {
                            response.project = project;
                            Project.findByIdAndUpdate(projectId, project, function(err) {
                                if (err) {
                                    console.log(err);
                                    err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                                    res.status(err.code).send(err);
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
 * Clone a public project
 */
exports.clone = function(req, res) {
    var projectId = req.params.id,
        userId = req.user._id;
    async.waterfall([
        Project.findById.bind(Project, projectId),
        function(project, next) {
            if (project._acl['user:' + userId] && project._acl['user:' + userId].permission === 'ADMIN') {
                next(null, project);
            } else {
                project.addAdded();
                Project.findByIdAndUpdate(projectId, project, next);
            }
        },
        function(project, next) {
            var newProject = new Project({
                creator: userId,
                name: req.body.name || project.name,
                description: project.description,
                videoUrl: project.videoUrl,
                code: project.code,
                codeProject: project.codeProject,
                defaultTheme: project.defaultTheme,
                hardware: project.hardware,
                software: project.software,
                hardwareTags: project.hardwareTags,
                userTags: project.userTags,
                useBitbloqConnect: project.useBitbloqConnect,
                bitbloqConnectBT: project.bitbloqConnectBT
            });

            newProject.save(next);
        },
        function(newProject, count, next) {
            ImageFunctions.cloneImages(projectId, newProject._id, function(err) {
                next(err, newProject);
            })
        }
    ], function(err, newProject) {
        if (err) {
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err)
        } else {
            res.status(200).json(newProject._id);
        }
    });
};

/**
 * Deletes a Project
 */
exports.destroy = function(req, res) {
    var userId = req.user._id,
        projectId = req.params.id;
    async.waterfall([
        Project.findById.bind(Project, projectId),
        function(project, next) {
            if (project) {
                if (project.isOwner(userId)) {
                    project.delete(next);
                } else {
                    next({
                        code: 401,
                        message: 'Unauthorized'
                    });
                }
            } else {
                next({
                    code: 404,
                    message: 'Exercise not found'
                });
            }
        }

    ], function(err) {
        if (err) {
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            res.status(204).end();
        }
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};
var numRequests = 0,
    numRequestsOK = 0,
    numRequestsKO = 0,
    numRepeatedItems = 0,
    numItems = 0;

exports.createAll = function(req, res) {
    numRequests++;
    console.log('numRequest', numRequests);
    async.each(req.body, function(item, done) {
        Project.findOne({
            'corbelId': item.corbelId
        }, function(err, response) {
            if (err) {
                done(err);
            } else if (!response) {
                numItems++;
                var newProject = new Project(item);
                newProject.save(done);
            } else {
                numRepeatedItems++;
                response.update(item, done);
            }
        });
    }, function(err) {
        console.log('Finish request');
        console.log('numRequests:', numRequests, 'numRequestsOK:', numRequestsOK, 'numRequestsKO:', numRequestsKO);
        console.log('Items', numItems, 'Repeated', numRepeatedItems);
        if (err) {
            numRequestsKO++;
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            numRequestsOK++;
            res.sendStatus(200);
        }
    });

};
