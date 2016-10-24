'use strict';

var express = require('express'),
    controller = require('./center.controller.js'),
    auth = require('../../components/auth/auth.service');

var router = express.Router();

//HEAD
router.head('/center/:type', auth.isAuthenticated(), controller.isHeadMaster);
// GET
router.get('/exercise/:id', auth.isAuthenticated(), controller.getExercise);
router.get('/exercise/:task', auth.isAuthenticated(), controller.getExerciseByTask);
router.get('/task/:id', auth.isAuthenticated(), controller.getTask);
router.get('/group/:id', auth.isAuthenticated(), controller.getGroup);
router.get('/group/teacher/:id', auth.isAuthenticated(), controller.getGroupByTeacher);
router.get('/center/:id', auth.isAuthenticated(), controller.getCenter);
router.get('/center/:centerId/teacher', auth.isAuthenticated(), controller.getTeachers);

// POST
router.post('/exercise', auth.isAuthenticated(), controller.createExercise);
router.post('/task', auth.isAuthenticated(), controller.createTask);
router.post('/group', auth.isAuthenticated(), controller.createGroup);
router.post('/center/:centerId/teacher', auth.isAuthenticated(), controller.addTeacher);
router.post('/center', auth.isAuthenticated(), controller.createCenter);

// PUT
router.put('/exercise/:id', auth.isAuthenticated(), controller.updateExercise);
router.put('/task/:id', auth.isAuthenticated(), controller.updateTask);
router.put('/group/:id', auth.isAuthenticated(), controller.updateGroup);
router.put('/center/:id', auth.isAuthenticated(), controller.updateCenter);

// DELETE
router.delete('/exercise/:id', auth.isAuthenticated(), controller.deleteExercise);
router.delete('/task/:id', auth.isAuthenticated(), controller.deleteTask);
router.delete('/group/:id', auth.isAuthenticated(), controller.deleteGroup);
router.delete('/center/:id', auth.isAuthenticated(), controller.anonCenter);
router.delete('/center/:centerId/teacher/:teacherId', auth.isAuthenticated(), controller.deleteTeacher); 

module.exports = router;
