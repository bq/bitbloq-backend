'use strict';
var Answer = require('./models/answer.model'),
    Category = require('./models/category.model'),
    Thread = require('./models/thread.model'),
    utils = require('../utils'),
    Promise = require('bluebird');

/**
 * Create Category
 */
exports.createCategory = function(req, res) {
    var newCategory = new Category(req.body);
    newCategory.save().then(function() {
        res.sendStatus(200);
    }).catch(utils.validationError(res));
};

/**
 * Create Thread
 */
exports.createThread = function(req, res) {
    var newThread = new Thread(req.body.thread);
    var newAnswer = new Answer(req.body.answer);
    var matchThread = new Thread({
        categoryId: req.body.thread.categoryId
    });
    // Save the thread
    newThread.save().then(function() {
        newAnswer.threadId = newThread._id;
        // Save the answer
        newAnswer.save().then(function() {
            // Get all threads in category
            matchThread.getThreadsInCategory({
                categoryId: req.body.categoryId
            }).then(function(threads) {
                // Count answers and threads
                var numberOfAnswers = 0;
                var numberOfThreads = threads.length;
                threads.forEach(function(thread) {
                    if (thread.numberOfAnswers > 1) {
                        numberOfAnswers += thread.numberOfAnswers - 1
                        console.log('Tiene', thread.numberOfAnswers);
                    } else if (thread.numberOfAnswers === 1) {
                        if (thread._id !== newThread._id) {
                            numberOfAnswers += 1;
                        }
                    }
                });
                console.log('Total: ', numberOfAnswers);
                // Update Category stats
                Category.findOneAndUpdate({
                    uuid: newThread.categoryId
                }, {
                    numberOfThreads: numberOfThreads,
                    lastThread: newThread,
                    numberOfAnswers: numberOfAnswers
                }).then(function() {
                    res.status(200).send(newThread._id);
                }).catch(utils.handleError(res));
            }).catch(utils.handleError(res));
        }).catch(utils.validationError(res));
    }).catch(utils.validationError(res));
};

/**
 * Create Answer
 */
exports.createAnswer = function(req, res) {
    var newAnswer = new Answer(req.body);
    newAnswer.save().then(function() {
        newAnswer.countAnswersInThread({
            threadId: req.body.threadId
        }).then(function(numberOfAnswers) {
            if (numberOfAnswers <= 1) {
                numberOfAnswers = 0;
            } else {
                numberOfAnswers = numberOfAnswers - 1
            }
            Thread.findByIdAndUpdate(newAnswer.threadId, {
                new: true,
                lastAnswer: newAnswer,
                numberOfAnswers: numberOfAnswers
            }).then(function(thread) {
                Category.findOneAndUpdate({
                    uuid: thread.categoryId
                }, {
                    $set: {
                        lastThread: thread
                    },
                    $inc: {
                        numberOfAnswers: 1
                    }
                }).then(function() {
                    res.sendStatus(200);
                }).catch(utils.handleError(res));
            }).catch(utils.handleError(res));
        }).catch(utils.handleError(res))
    }).catch(utils.validationError(res));
};

/**
 * Gets Main forum section
 */
exports.showForumIndex = function(req, res) {
    var mainForumCategories = [],
        promisesArr;

    Category.findAsync({}).then(function(categories) {

        promisesArr = categories.map(function(category) {
            var defCat = {
                name: category.name,
                section: category.section,
                description: category.description,
                order: category.order,
                numberOfThreads: category.numberOfThreads,
                numberOfAnswers: category.numberOfAnswers,
                lastThread: category.lastThread,
                uuid: category.uuid
            };
            mainForumCategories.push(defCat);
            Promise.resolve();
        });

        return Promise.all(promisesArr).then(function() {
            res.status(200).json(mainForumCategories);
        });
    }).catch(utils.handleError(res));

};
/**
 * Get all threads in a category
 */
exports.showThreadsInCategory = function(req, res) {
    var matchThread;

    switch (req.params.by) {
        case 'uuid':
            matchThread = new Thread({
                categoryId: req.params.id
            });

            matchThread.getThreadsInCategory().sort('-updatedAt').then(function(threads) {
                res.status(200).json(threads);
            }).catch(utils.handleError(res));
            break;
        case 'id':
            Category.findById(req.params.id, {
                uuid: 'uuid',
                _id: 0
            }).then(function(response) {

                matchThread = new Thread({
                    categoryId: response.uuid
                });
                matchThread.getThreadsInCategory().sort('-updatedAt').then(function(threads) {
                    res.status(200).json(threads);
                }).catch(utils.handleError(res));
            });
            break;
        case 'name':
            var query = Category.where({
                name: req.params.id
            });
            query.findOne({}, {
                uuid: 'uuid',
                _id: 0
            }).then(function(response) {
                matchThread = new Thread({
                    categoryId: response.uuid
                });
                matchThread.getThreadsInCategory().sort('-updatedAt').then(function(threads) {
                    res.status(200).json(threads);
                }).catch(utils.handleError(res));
            });

            break;
        default:
            res.status(422).send('You need to provide "id" or "uuid" ');
    }
};

/**
 * Get a single thread by Id
 */
exports.showThread = function(req, res) {
    var matchThread = new Thread({
        _id: req.params.id
    });
    matchThread.getThread().then(function(thread) {
        res.status(200).json(thread);
    }).catch(utils.handleError(res));
};

/**
 * Get all answers in a thread
 */
exports.showAnswersInThread = function(req, res) {
    var matchAnswers = new Answer({
        threadId: req.params.id
    });
    matchAnswers.getAnswersInThread().then(function(answers) {
        res.status(200).json(answers);
    }).catch(utils.handleError(res));
};

/**
 * Update a thread
 */
exports.updateThread = function(req, res) {
    var threadId = req.params.id;
    var threadData = req.body
    Thread.findByIdAndUpdateAsync(threadId, threadData).then(function() {
        res.sendStatus(200);
    }).catch(utils.handleError(res));
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
    }).then(function() {
        res.sendStatus(200);
    }).catch(utils.handleError(res));
};

/**
 * Update an answer
 */
exports.updateAnswer = function(req, res) {
    var answerId = req.params.id;
    var answerData = req.body
    Thread.findByIdAndUpdateAsync(answerId, answerData).then(function() {
        res.sendStatus(200);
    }).catch(utils.handleError(res));
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
                    lastAnswerDate: thread.updatedAt,
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
    Thread.findByIdAndRemoveAsync(threadId, {
        new: true
    }).then(function(thread) {
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
};