'use strict';
var Answer = require('./models/forumanswer.model.js'),
    Category = require('./models/forumcategory.model.js'),
    Thread = require('./models/forumthread.model.js'),
    UserFunctions = require('../user/user.functions.js'),
    async = require('async'),
    mailer = require('../../components/mailer'),
    config = require('../../res/config.js'),
    _ = require('lodash'),
    itemsPerPage = 10;

function countAnswersThread(thread, next) {
    Answer.count({
        thread: thread._id,
        main: false
    }, next);
}

function getLastAnswer(thread, next) {
    Answer.findOne({
            thread: thread._id
        }, null, {
            sort: {
                'updatedAt': -1
            }
        })
        .populate('creator', 'username')
        .exec(next);
}

function getSubscribersEmail(threadId, next) {
    Thread.findById(threadId)
        .populate('subscribers', 'email')
        .exec(next);
}

function getThreadsInCategory(category, next) {
    Thread
        .find({
            category: category._id
        })
        .lean()
        .populate('creator', 'username')
        .sort('-updatedAt').exec(function(err, threads) {
        if (err) {
            next(err);
        } else {
            async.map(threads, function(thread, next) {
                async.parallel([
                    countAnswersThread.bind(null, thread),
                    getLastAnswer.bind(null, thread)
                ], function(err, results) {
                    if (results) {
                        thread.numberOfAnswers = results[0];
                        thread.lastAnswer = results[1] || {};
                        next(err, thread);
                    } else {
                        next(err, []);
                    }
                });
            }, function(err, completedThreads) {
                next(err, {
                    category: category,
                    threads: completedThreads
                });
            })
        }
    });
}

function getCompletedThread(id, next) {
    Thread.findById(id)
        .populate('creator', '_id username')
        .exec(next);
}

function getCompletedAnswer(themeId, next) {
    Answer.find({
            thread: themeId
        })
        .sort('updatedAt')
        .populate('creator', 'username')
        .exec(next);
}

function countThreadsInCategories(next) {
    Thread.aggregate([{
        $lookup: {
            from: 'forumcategories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
        }
    }, {
        $group: {
            _id: '$category._id',
            numberOfThreads: {
                $sum: 1
            }
        }
    }], next);
}

function countAnswersInCategories(next) {
    Answer.aggregate([{
        $lookup: {
            from: 'forumthreads',
            localField: 'thread',
            foreignField: '_id',
            as: 'thread'
        }
    }, {
        $match: {
            main: false
        }
    }, {
        $group: {
            _id: '$thread.category',
            numberOfAnswers: {
                $sum: 1
            }
        }
    }], next);
}

function getLastThreads(next) {
    Thread.aggregate([{
        $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'user'
        }
    }, {
        $group: {
            _id: '$_id',
            title: {
                $first: '$title'
            },
            creator: {
                $first: {
                    username: '$user.username'
                }
            },
            numberOfViews: {
                $first: '$numberOfViews'
            },
            category: {
                $first: '$category'
            },
            updatedAt: {
                $first: '$updatedAt'
            }
        }
    }, {
        $sort: {
            updatedAt: -1
        }
    }], function(err, result) {
        if (result) {
            result.forEach(function(item) {
                item.creator.username = _.toString(item.creator.username) || 'Anonimo';
            });
        }
        next(err, result);
    });
}

function searchThreadsPage(titleRegex, page, next) {
    Thread.find({
            title: titleRegex
        })
        .populate('creator', 'username')
        .populate('category', 'name')
        .skip(itemsPerPage * (page - 1)) // page start counting in 1 (if page == 1 -> skip 0)
        .limit(itemsPerPage)
        .sort('-updatedAt')
        .exec(next)
}

/**
 * Create Category
 */
exports.createCategory = function(req, res) {
    var newCategory = new Category(req.body);
    newCategory.save(function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * Create Thread
 */
exports.createThread = function(req, res) {

    var userId = req.user._id;

    UserFunctions.isBanned(userId, function(err, banned) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else if (banned) {
            res.sendStatus(401);
        } else {
            var newThread = new Thread(req.body.thread),
                newAnswer = new Answer(req.body.answer);

            newThread.creator = userId;
            async.waterfall([
                newThread.save,
                function(thread, saved, next) {
                    newAnswer.thread = newThread._id;
                    newAnswer.category = newThread.category;
                    newAnswer.creator = userId;
                    // Save the answer
                    newAnswer.save(next);
                },
                function(answer, saved, next) {
                    Category.findOne({
                        _id: answer.category
                    }, 'name', function(err, category) {
                        next(err, answer, category.name);
                    })
                }
            ], function(err, answer, categoryName) {
                if (err) {
                    console.log(err);
                    err.code = parseInt(err.code) || 500;
                    res.status(err.code).send(err);
                } else {
                    var locals = {
                        email: config.supportEmail,
                        emailTObbc: config.emailTObbc,
                        subject: 'Nuevo tema en el foro de Bitbloq',
                        username: req.user.username,
                        forumUrl: config.client_domain + '/#/help/forum/' + encodeURIComponent(categoryName) + '/' + answer.thread,
                        threadTitle: newThread.title,
                        threadContent: answer.content
                    };

                    mailer.sendOne('newForumThread', locals, function(err) {
                        if (err) {
                            console.log(err);
                            err.code = parseInt(err.code) || 500;
                            res.status(err.code).send(err);
                        } else {
                            res.status(200).json({
                                thread: newThread,
                                answer: answer
                            });
                        }
                    });
                }
            });
        }
    });
};

/**
 * Create Answer
 */
exports.createAnswer = function(req, res) {
    var userId = req.user._id;

    UserFunctions.isBanned(userId, function(err, banned) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else if (banned) {
            res.sendStatus(401);
        } else {
            async.waterfall([
                Thread.findByIdAndUpdate.bind(Thread, req.body.thread, {
                    'updatedAt': Date.now()
                }),
                function(thread, next) {
                    var newAnswer = new Answer(req.body);
                    newAnswer.creator = userId;
                    newAnswer.save(function(err, answer) {
                        next(err, answer, thread);
                    });
                },
                function(answer, thread, next) {
                    Category.findOne({
                        _id: thread.category
                    }, 'name', function(err, category) {
                        next(err, answer, thread, category.name);
                    });
                }

            ], function(err, answer, thread, categoryName) {
                if (err) {
                    console.log(err);
                    err.code = parseInt(err.code) || 500;
                    res.status(err.code).send(err);
                } else {
                    //enviar mail para soporte

                    async.waterfall([
                            function(cb) {
                                getSubscribersEmail(thread._id, cb)
                            },
                            function(thread, cb) {
                                var subscribersEmails = _.reduce(thread.subscribers, function(results, person) {
                                    if (person._id.toString() !== req.user._id.toString()) {
                                        results.push(person.email);
                                    }
                                    return results;
                                }, []);
                                var subscribersBBC = _.join(subscribersEmails);

                                var locals = {
                                    email: config.supportEmail,
                                    emailTObbc: config.emailTObbc + ',' + subscribersBBC,
                                    subject: 'Bitbloq- Nueva respuesta en el tema ' + thread.title,
                                    username: req.user.username,
                                    forumUrl: config.client_domain + '/#/help/forum/' + encodeURIComponent(categoryName) + '/' + answer.thread,
                                    answerTitle: thread.title,
                                    answerContent: answer.content
                                };

                                mailer.sendOne('newForumAnswer', locals, cb);
                            }
                        ],
                        function(err) {
                            if (err) {
                                console.log(err);
                                err.code = parseInt(err.code) || 500;
                                res.status(err.code).send(err);
                            } else {
                                res.status(200).send(answer._id);
                            }
                        });
                }
            });
        }
    });
};

/**
 * Gets Main forum section
 */
exports.getForumIndex = function(req, res) {

    async.parallel([
        Category.find.bind(Category, {}),
        countThreadsInCategories,
        countAnswersInCategories,
        getLastThreads
    ], function(err, result) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            var categories = result[0],
                threadsCounter = _.groupBy(result[1], '_id[0]'),
                answersCounter = _.groupBy(result[2], '_id[0]'),
                lastTheads = _.groupBy(result[3], 'category'),
                completedCategories = [];

            categories.forEach(function(category) {
                var categoryObject = category.toObject();
                categoryObject.numberOfThreads = threadsCounter[categoryObject._id] ? threadsCounter[categoryObject._id][0].numberOfThreads : 0;
                categoryObject.numberOfAnswers = answersCounter[categoryObject._id] ? answersCounter[categoryObject._id][0].numberOfAnswers : 0;
                categoryObject.lastThread = lastTheads[categoryObject._id] ? lastTheads[categoryObject._id][0] : {};
                completedCategories.push(categoryObject);
            });

            res.status(200).json(completedCategories);
        }
    });
};

//exports.getForumIndex();

/**
 * Get info category and all threads in a category
 */
exports.getCategory = function(req, res) {
    var categoryName = req.params.category;
    async.waterfall([
        Category.findOne.bind(Category, {
            name: categoryName
        }),
        getThreadsInCategory
    ], function(err, completedCategory) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).json(completedCategory);
        }
    });
};

/**
 * Get a single thread by Id
 */
exports.getThread = function(req, res) {
    var themeId = req.params.id;
    async.parallel([
        getCompletedThread.bind(null, themeId),
        getCompletedAnswer.bind(null, themeId)
    ], function(err, results) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            if (results) {
                var threadObject = results[0];
                threadObject.numberOfAnswers = results[1].length - 1;
                if (req.user && (threadObject.creator._id.toString() !== req.user._id.toString())) {
                    var thread = new Thread(threadObject);
                    thread.addView();
                    Thread.findByIdAndUpdate(thread._id, thread, function(err, thread) {
                        if (err) {
                            console.log(err);
                            err.code = parseInt(err.code) || 500;
                            res.status(err.code).send(err);
                        } else {
                            res.status(200).json({
                                thread: thread,
                                answers: results[1]
                            });
                        }
                    });
                } else {
                    res.status(200).json({
                        thread: threadObject,
                        answers: results[1]
                    });
                }
            }
        }
    });
};

/**
 * Search threads page with partialTitle
 */
exports.searchThreads = function(req, res) {
    var titleRegex = new RegExp(req.query.partialTitle, "i"),
        page = req.query.page || 1;

    async.parallel([
            function(callback) {
                Thread.find({
                    title: titleRegex
                }).count(callback);
            },
            searchThreadsPage.bind(null, titleRegex, page)
        ],
        function(err, result) {
            if (err) {
                console.log(err);
                err.code = parseInt(err.code) || 500;
                res.status(err.code).send(err);
            } else {
                res.status(200).json({
                    count: result[0],
                    threads: result[1],
                    itemsPerPage: itemsPerPage
                });
            }
        });
};

/**
 * Update a thread
 */
exports.moveThread = function(req, res) {

    var threadId = req.params.id;
    var categoryName = req.params.categoryName;
    Category.findOne({
        name: categoryName
    }, function(err, category) {
        Thread.findByIdAndUpdate(threadId, {
            category: category._id
        }, function(err) {
            if (err) {
                console.log(err);
                err.code = parseInt(err.code) || 500;
                res.status(err.code).send(err);
            } else {
                res.sendStatus(200);
            }
        });
    });
};

/**
 * Update a thread
 */
exports.updateThread = function(req, res) {
    var threadId = req.params.id;
    var threadData = req.body;
    Thread.findByIdAndUpdate(threadId, threadData, function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * Update an answer
 */
exports.updateAnswer = function(req, res) {
    var answerId = req.params.id;
    Answer.findById(answerId, function(err, answer) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            if (answer.isOwner(req.user._id)) {
                answer = _.extend(answer, req.body);
                answer.save(function(err) {
                    if (err) {
                        console.log(err);
                        err.code = parseInt(err.code) || 500;
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
 * Delete an answer
 */
exports.destroyAnswer = function(req, res) {
    Answer.findById(req.params.id, function(err, answer) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            if (answer) {
                answer.remove(function(err) {
                    if (err) {
                        console.log(err);
                        err.code = parseInt(err.code) || 500;
                        res.status(err.code).send(err);
                    } else {
                        res.sendStatus(200);
                    }
                });
            } else {
                res.sendStatus(404);
            }
        }
    });
};

/**
 * Delete a thread
 */
exports.destroyThread = function(req, res) {
    var threadId = req.params.id;
    async.waterfall([
        Answer.find.bind(Answer, {
            thread: threadId
        }),
        function(answers, next) {
            async.each(answers, function(answer, done) {
                answer.remove(done);
            }, next);
        },
        Thread.findByIdAndRemove.bind(Thread, threadId)
    ], function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.createAllCategories = function(req, res) {
    Category.create(req.body, function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.deleteAllCategories = function(req, res) {
    Category.remove({}, function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.createForceThread = function(req, res) {
    delete req.body._id;
    var thread = new Thread(req.body);
    thread.save(req.body, function(err, thread) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).send(thread._id);
        }
    });
};

exports.createAllThreads = function(req, res) {
    Thread.create(req.body, function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};
exports.createAllAnswers = function(req, res) {
    Answer.create(req.body, function(err) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.createForceAnswer = function(req, res) {
    var answer = new Answer(req.body);
    answer.save(req.body, function(err, answer) {
        if (err) {
            console.log(err);
            err.code = parseInt(err.code) || 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).send(answer._id);
        }
    });
};

exports.subscribeToThread = function(req, res) {
    async.waterfall([
        function(cb) {
            Thread.findById(req.params.id, cb);
        },
        function(thread, cb) {
            if (thread.subscribers.indexOf(req.user._id) > -1) {
                cb(409);
            } else {
                thread.subscribers.push(req.user._id);
                var threadUpdated = new Thread(thread);
                threadUpdated.save(cb);
            }
        }
    ], function(err) {
        if (err) {
            console.log(err);
            res.status(409).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.unsubscribeToThread = function(req, res) {
    async.waterfall([
        function(cb) {
            Thread.findById(req.params.id, cb);
        },
        function(thread, cb) {
            if (thread.subscribers.indexOf(req.user._id) > -1) {
                _.remove(thread.subscribers, req.user._id);
                var threadUpdated = new Thread(thread);
                threadUpdated.save(cb);
            } else {
                cb(409);
            }
        }
    ], function(err) {
        if (err) {
            console.log(err);
            res.status(409).send(err);
        } else {
            res.sendStatus(200);
        }
    });

};
