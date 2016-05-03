'use strict';
var Answer = require('./models/answer.model'),
    Category = require('./models/category.model'),
    Thread = require('./models/thread.model'),
    async = require('async');


function completeCategory(category, next) {
    //todo get stats
    next(null, {
        name: category.name,
        section: category.section,
        description: category.description,
        order: category.order,
        numberOfThreads: category.numberOfThreads,
        numberOfAnswers: category.numberOfAnswers,
        lastThread: category.lastThread,
        uuid: category.uuid
    });
}


/**
 * Create Category
 */
exports.createCategory = function(req, res) {
    var newCategory = new Category(req.body);
    newCategory.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * Create Thread
 */
exports.createThread = function(req, res) {
    var newThread = new Thread(req.body.thread),
        newAnswer = new Answer(req.body.answer),
        matchThread = new Thread({categoryId: req.body.thread.categoryId});


    async.waterfall([
        newThread.save,
        function(thread, saved, next) {
            newAnswer.threadId = newThread._id;
            // Save the answer
            newAnswer.save(next);
        },
        function(answer, saved, next) {
            matchThread.getThreadsInCategory({categoryId: req.body.categoryId}, next);
        },
        function(threads, next) {
            var numberOfAnswers = 0;
            var numberOfThreads = threads.length;
            threads.forEach(function(thread) {
                if (thread.numberOfAnswers > 1) {
                    numberOfAnswers += thread.numberOfAnswers - 1;
                } else if (thread.numberOfAnswers === 1) {
                    if (thread._id !== newThread._id) {
                        numberOfAnswers += 1;
                    }
                }
            });
            next(null, numberOfThreads);
        },
        function(numberOfThreads, next) {
            Category.findOneAndUpdate({
                uuid: newThread.categoryId
            }, {
                numberOfThreads: numberOfThreads,
                lastThread: newThread,
                numberOfAnswers: numberOfAnswers
            }, next);
        }
    ], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(newThread._id);
        }
    });
};

/**
 * Create Answer
 */
exports.createAnswer = function(req, res) {
    var newAnswer = new Answer(req.body);
    newAnswer.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            newAnswer.countAnswersInThread({
                threadId: req.body.threadId
            }, function(err, numberOfAnswers) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (numberOfAnswers <= 1) {
                        numberOfAnswers = 0;
                    } else {
                        numberOfAnswers = numberOfAnswers - 1
                    }
                    Thread.findByIdAndUpdate(newAnswer.threadId, {
                        new: true,
                        lastAnswer: newAnswer,
                        numberOfAnswers: numberOfAnswers
                    }, function(err, thread) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            Category.findOneAndUpdate({
                                uuid: thread.categoryId
                            }, {
                                $set: {
                                    lastThread: thread
                                },
                                $inc: {
                                    numberOfAnswers: 1
                                }
                            }, function(err) {
                                if (err) {
                                    res.status(500).send(err);
                                } else {
                                    res.sendStatus(200);
                                }
                            });
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
exports.showForumIndex = function(req, res) {
    Category.find({}, function(err, categories) {
        if (err) {
            res.status(500).send(err);
        } else {
            async.map(categories, completeCategory, function(err, mainForumCategories) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).json(mainForumCategories);
                }
            });
        }
    });
};


/**
 * Get all threads in a category
 */
exports.showThreadsInCategory = function(req, res) {
    var matchThread;
    var category = req.params.category;
    Category.findOne({name: category}, function(err, category) {
        if (err) {
            res.status(500).send(err);
        } else {
            Thread.find({categoryId: category.uuid}).sort('-updatedAt').exec(function(err, threads) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).json(threads);
                }
            })
        }
    });
};

/**
 * Get a single thread by Id
 */
exports.getThread = function(req, res) {
    var themeId = req.params.id;

    async.parallel([
        Thread.findById.bind(Thread, themeId),
        Answer.find.bind(Answer, {threadId: themeId})

    ], function(err, results) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).json({thread: results[0], answers: results[1]});
        }
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
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * Update thread views
 */
exports.updateThreadViews = function(req, res) {
    var threadId = req.params.id;
    Thread.findByIdAndUpdateAsync(threadId, {
        $inc: {
            numberOfViews: 1
        }
    }, function(err) {
        if (err) {
            res.status(500).send(err);
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
    var answerData = req.body;
    Thread.findByIdAndUpdateAsync(answerId, answerData, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * Deletes an answer
 */
exports.destroyAnswer = function(req, res) {
    var answerId = req.params.id,
        threadId = req.params.threadid;

    Answer.findByIdAndRemove(answerId)
        .then(function() {
            var matchAnswers = new Answer({
                threadId: threadId
            });
            matchAnswers.getLastThreadInCategory().then(function(thread) {
                Thread.findByIdAndUpdate(thread._id, {
                    lastAnswerDate: thread.updatedAt
                }, {
                    $inc: {
                        numberOfAnswers: -1
                    }
                }).then(function() {
                    Category.findOneAndUpdate({
                        uuid: thread.categoryId
                    }, {
                        $inc: {
                            numberOfAnswers: -1
                        }
                    }).then(function() {
                        res.status(204).end();
                    }).catch(utils.handleError(res));
                }).catch(utils.handleError(res));
            });
        }).catch(utils.handleError(res));
};

/**
 * Deletes a thread
 */
exports.destroyThread = function(req, res) {
    var threadId = req.params.id;
    var matchAnswers = new Answer({
        threadId: threadId
    });
    matchAnswers.removeAnswersInThread(function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            Thread.findByIdAndRemove(threadId, {
                new: true
            }, function(err, thread) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    Category.findOneAndUpdate({
                        uuid: thread.categoryId
                    }, {
                        $inc: {
                            numberOfAnswers: -1
                        }
                    }, function(err) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.status(204).end();
                        }
                    });
                }
            });
        }
    });
};
