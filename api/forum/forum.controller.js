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
    var newThread = new Thread(req.body);
    newThread.save().then(function() {
        res.sendStatus(200);
    }).catch(utils.validationError(res));
};

/**
 * Create Answer
 */
exports.createAnswer = function(req, res) {
    var newAnswer = new Answer(req.body);
    newAnswer.save().then(function() {
        res.sendStatus(200);
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

            var matchThread = new Thread({
                categoryId: category.uuid
            });

            return matchThread.countThreadsInCategory().then(function(numberOfThreads) {

                if (numberOfThreads > 0) {

                    return matchThread.getLastThreadInCategory().then(function(thread) {

                        var countAnswers = new Answer({
                            threadId: thread._id
                        });

                        return countAnswers.countAnswersInThread().then(function(numberOfAnswers) {

                            var defCat = {
                                name: category.name,
                                numberOfThreads: numberOfThreads,
                                numberOfAnswers: numberOfAnswers,
                                lastThread: thread
                            };

                            mainForumCategories.push(defCat);
                            Promise.resolve();
                        });
                    });

                } else {

                    var defCat = {
                        name: category.name,
                        numberOfThreads: 0,
                        numberOfAnswers: 0,
                        lastThread: ''
                    };

                    mainForumCategories.push(defCat);
                    Promise.resolve();
                }
            });
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

    var matchThread = new Thread({
        categoryId: req.params.id
    });

    matchThread.getThreadsInCategory().then(function(threads) {
        res.status(200).json(threads);
    }).catch(utils.handleError(res));
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
        themeId: req.params.thread
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
    var answerId = req.params.id;
    Answer.findByIdAndRemoveAsync(answerId)
        .then(function() {
            res.status(204).end();
        })
        .catch(utils.handleError(res));
};

/**
 * Deletes a thread
 */
exports.destroyThread = function(req, res) {
    var threadId = req.params.id;
    Thread.findByIdAndRemoveAsync(threadId)
        .then(function() {
            res.status(204).end();
        })
        .catch(utils.handleError(res));
};