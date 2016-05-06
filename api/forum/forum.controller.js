'use strict';
var Answer = require('./models/forumanswer.model'),
    Category = require('./models/forumcategory.model'),
    Thread = require('./models/forumthread.model'),
    async = require('async'),
	mailer = require('../../components/mailer'),
    config = require('../../config/environment');


function completeCategory(category, next) {
    async.parallel([
        Answer.count.bind(Answer, {categoryId: category.uuid, main: false}),
        Thread.count.bind(Thread, {categoryId: category.uuid}),
        Thread.findOne.bind(Thread, {}, null, {sort: {'updatedAt': -1}})
    ], function(err, results) {
        if (err) {
            next(err);
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
            next(err);
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
            next(err);
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
            next(err);
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
        },
        function(answer, saved, next) {
            Category.findOne({uuid: answer.categoryId}, 'name', function(err, category) {
                next(err, answer, category.name);
            })
        }
    ], function(err, answer, categoryName) {
        if (err) {
            res.status(500).send(err);
        } else {
            var locals = {
                email: config.supportEmail,
                subject: 'Nuevo tema en el foro de Bitbloq',
                username: answer.owner.username,
                categoryName: categoryName,
                forumUrl: 'http://bitbloq.bq.com/#/help/forum/' + categoryName + '/' + answer.threadId
            };

            mailer.sendOne('newForumThread', locals, function(err) {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(newThread._id);
            });
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
        },
        function(answer, saved, next) {
            Category.findOne({uuid: answer.categoryId}, 'name', function(err, category) {
                next(err, answer, category.name);
            })
        }
    ], function(err, answer, categoryName) {
        if (err) {
            res.status(500).send(err);
        } else {
            var locals = {
                email: config.supportEmail,
                subject: 'Nueva respuesta en el foro de Bitbloq',
                username: answer.owner.username,
                categoryName: categoryName,
                forumUrl: 'http://bitbloq.bq.com/#/help/forum/' + categoryName + '/' + answer.threadId
            };

            mailer.sendOne('newForumAnswer', locals, function(err) {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send();
            });
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
        if (err) {
            res.status(500).send(err);
        } else {
            var threadObject = results[0].toObject();
            threadObject.numberOfAnswers = results[1].length - 1;
            if (req.user && threadObject.creator._id != req.user._id) {
                var thread = results[0];
                thread.addView();
                Thread.findByIdAndUpdate(thread._id, thread, function(err, thread) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.status(200).json({thread: thread, answers: results[1]});
                    }
                });
            } else {
                res.status(200).json({thread: threadObject, answers: results[1]});
            }
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
    Answer.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            //Todo destroy images in answer
            res.sendStatus(200);
        }
    });
};

/**
 * Deletes a thread
 */
exports.destroyThread = function(req, res) {
    var threadId = req.params.id;
    async.waterfall([
        Answer.remove.bind(Answer, {threadId: threadId}),
        Thread.findByIdAndRemove.bind(Thread, threadId)
    ], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
};

exports.createAllCategories = function(req, res) {
    Category.collection.insert(req.body, function(err) {
        if (err) {
            utils.handleError(res, null, err)
        } else {
            res.sendStatus(200);
        }
    });
};

exports.deleteAllCategories = function(req, res) {
    Category.remove({}, function(err) {
        if (err) {
            utils.handleError(res, null, err)
        } else {
            res.sendStatus(200);
        }
    });
};