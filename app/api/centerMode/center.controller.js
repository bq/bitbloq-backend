'use strict';

var Center = require('./models/center.model.js'),
    UserFunctions = require('../user/user.functions.js'),
    async = require('async');


/**
 * Create center
 * @param req
 * @param res
 */
exports.addTeacher = function(req, res) {
    var userId = req.user._id,
        newTeacherEmails = req.body,
        centerId = req.params.centerId;
    async.parallel([
        UserFunctions.getCenterWithUserAdmin.bind(UserFunctions, userId, centerId),
        UserFunctions.getAllUsersByEmails.bind(UserFunctions, newTeacherEmails)
    ], function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(401);
        } else if (!result) {
            res.sendStatus(304);
        } else {
            UserFunctions.addAllTeachers(result[1], result[0], function(err, newuser) {
                if (err) {
                    console.log(err);
                    res.status(err.code).send(err);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
};

/**
 * Create an exercise
 * @param req
 * @param res
 */
exports.createExercise = function(req, res) {

};

/**
 * Create task
 * @param req
 * @param res
 */
exports.createTask = function(req, res) {

};

/**
 * Create group
 * @param req
 * @param res
 */
exports.createGroup = function(req, res) {

};

/**
 * Create center
 * @param req
 * @param res
 */
exports.createCenter = function(req, res) {

};

/**
 * Get teachers in a center
 * @param req
 * @param res
 */
exports.getTeachers = function(req, res) {
    var userId = req.user._id,
        centerId = req.params.centerId;
    async.waterfall([
        UserFunctions.getCenterWithUserAdmin.bind(UserFunctions, userId, centerId),
        function(centerId, next) {
            UserFunctions.getAllTeachers(centerId, next);
        }
    ], function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(401);
        } else if (!result) {
            res.sendStatus(304);
        } else {
            res.send(result);
        }
    });
};

/**
 * Get info of exercise by id
 * @param req
 * @param res
 */
exports.getExercise = function(req, res) {

};

/**
 * Get a exercise by its task
 * @param req
 * @param res
 */
exports.getExerciseByTask = function(req, res) {

};

/**
 * Get student task
 * @param req
 * @param res
 */
exports.getTask = function(req, res) {

};

/**
 * Get student group
 * @param req
 * @param res
 */
exports.getGroup = function(req, res) {

};

/**
 * Get student group by its teacher
 * @param req
 * @param res
 */
exports.getGroupByTeacher = function(req, res) {

};

/**
 * Get center
 * @param req
 * @param res
 */
exports.getCenter = function(req, res) {

};

/**
 * Returns if a user is head master
 * @param req
 * @param res
 */
exports.isHeadMaster = function(req, res){
    var userId = req.user._id;
    UserFunctions.getCenterIdbyHeadMaster(userId, function(err, result){
        if(err){
            res.status(err.code).send(err);
        } else {
            res.send(!!result);
        }
    });
};

/**
 * Update an exercise ir user is owner
 * @param req
 * @param res
 */
exports.updateExercise = function(req, res) {

};

/**
 * Update a task if user is owner
 * @param req
 * @param res
 */
exports.updateTask = function(req, res) {

};

/**
 * Update a student group
 * @param req
 * @param res
 */
exports.updateGroup = function(req, res) {

};

/**
 * Update center information
 * @param req
 * @param res
 */
exports.updateCenter = function(req, res) {

};

/**
 * Delete an exercise if user is owner
 * @param req
 * @param res
 */
exports.deleteExercise = function(req, res) {

};

/**
 * Delete a group if user is owner
 * @param req
 * @param res
 */
exports.deleteGroup = function(req, res) {

};


/**
 * Delete a task if user is owner
 * @param req
 * @param res
 */
exports.deleteTask = function(req, res) {

};

/**
 * Delete a teacher in a center
 * @param req
 * @param res
 */
exports.deleteTeacher = function(req, res) {
    var userId = req.user._id,
        centerId = req.params.centerId,
        teacherId = req.params.teacherId;
    async.waterfall([
        UserFunctions.getCenterWithUserAdmin.bind(UserFunctions, userId, centerId),
        function(centerId, next) {
            UserFunctions.deleteTeacher(teacherId, centerId, next);
        }
    ], function(err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(401);
        } else if (!result) {
            res.sendStatus(304);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * Make anonymous a center if user is owner
 * @param req
 * @param res
 */
exports.anonCenter = function(req, res) {

};
