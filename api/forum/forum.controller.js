'use strict';
var Answer = require('./models/answer.model'),
    Category = require('./models/category.model'),
    Thread = require('./models/thread.model'),
    async = require('async');


function completeCategory(category, next) {
    async.parallel([
        Answer.count.bind(Answer, {categoryId: category.uuid, main: false}),
        Thread.count.bind(Thread, {categoryId: category.uuid}),
        Thread.findOne.bind(Thread, {}, null, {sort: {'updatedAt': -1}})
    ], function(err, results) {
        if (err) {
            next(500);
        } else {
            var categoryObject = category.toObject();
            categoryObject.numberOfAnswers = results[0];
            categoryObject.numberOfThreads = results[1];
            categoryObject.lastThread = results[2];
            next(null, categoryObject);
        }
    });
}

function countThreads(category, next) {
    Thread.count({categoryId: category._id}, function(err, counter) {
        if (err) {
            next(500);
        } else {
            var categoryObject = category.toObject();
            categoryObject.numberOfTreads = counter;
            next(null, categoryObject);
        }
    });
}

function getLastThread(category, next) {
    Thread.findOne().sort('-updatedAt').exec(function(err, lastThread) {
        var categoryObject = category.toObject();
        categoryObject.lastThread = lastThread;
        next(err, categoryObject);
    });
}


function countAnswersThread(thread, next) {
    Answer.count({threadId: thread._id, main: false}, function(err, counter) {
        if (err) {
            next(500);
        } else {
            var threadObject = thread.toObject();
            threadObject.numberOfAnswers = counter;
            next(null, threadObject);
        }
    });
}

function countAnswersCategory(threads) {
    var counter = 0;
    threads.forEach(function(thread) {
        counter += thread.numberOfAnswers;
    });
    return counter;
}

function getThreadsInCategory(category, next) {
    Thread.find({categoryId: category.uuid}).sort('-updatedAt').exec(function(err, threads) {
        if (err) {
            next(500);
        } else {
            async.map(threads, countAnswersThread, function(err, completedThreads) {
                var categoryObject = category.toObject();
                categoryObject.numberOfThreads = completedThreads.length;
                categoryObject.numberOfAnswers = countAnswersCategory(completedThreads);
                categoryObject.lastThread = completedThreads[0];
                next(err, {category: categoryObject, threads: completedThreads})
            })
        }
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
        newAnswer = new Answer(req.body.answer);

    async.waterfall([
        newThread.save,
        function(thread, saved, next) {
            newAnswer.threadId = newThread._id;
            newAnswer.categoryId = newThread.categoryId;
            // Save the answer
            newAnswer.save(next);
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
    async.waterfall([
        Thread.findByIdAndUpdate.bind(Thread, req.body.threadId, {'_updatedAt': Date.now()}),
        function(thread, next) {
            var newAnswer = new Answer(req.body);
            newAnswer.categoryId = thread.categoryId;
            newAnswer.save(next)
        }
    ], function(err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};


/**
 * Gets Main forum section
 */
exports.getForumIndex = function(req, res) {
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
 * Get info category and all threads in a category
 */
exports.getCategory = function(req, res) {
    var categoryName = req.params.category;
    async.waterfall([
        Category.findOne.bind(Category, {name: categoryName}),
        getThreadsInCategory
    ], function(err, completedCategory) {
        if (err) {
            res.status(500).send(err);
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
        Thread.findById.bind(Thread, themeId),
        Answer.find.bind(Answer, {threadId: themeId})

    ], function(err, results) {
        var thread = results[0].toObject();
        thread.numberOfAnswers = results[1].length - 1;
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json({thread: thread, answers: results[1]});
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
