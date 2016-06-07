'use strict';

var express = require('express'),
    controller = require('./forum.controller.js'),
    auth = require('../../components/auth/auth.service');

var router = express.Router();

// DELETE
router.delete('/answer/:id', auth.hasRole('admin'), controller.destroyAnswer);
router.delete('/thread/:id', auth.hasRole('admin'), controller.destroyThread);
router.delete('/category/all', auth.hasRole('admin'), controller.deleteAllCategories);

// GET
router.get('/', controller.getForumIndex);
router.get('/category/:category', controller.getCategory);
router.get('/thread/:id', auth.getUser(), controller.getThread);

// HEAD
router.head('/threadStats/views/:id', auth.isAuthenticated(), controller.updateThreadViews);

// POST
router.post('/category/all', auth.hasRole('admin'), controller.createAllCategories);
router.post('/category', auth.hasRole('admin'), controller.createCategory);
router.post('/thread/all', auth.hasRole('admin'), controller.createAllThreads);
router.post('/thread', auth.isAuthenticated(), controller.createThread);
router.post('/answer/all', auth.hasRole('admin'), controller.createAllAnswers);
router.post('/answer', auth.isAuthenticated(), controller.createAnswer);

// PUT
router.put('/thread/:id', auth.isAuthenticated(), controller.updateThread);
router.put('/thread/:id/moveTo/:categoryName', auth.hasRole('admin'), controller.moveThread);
router.put('/answer/:id', auth.isAuthenticated(), controller.updateAnswer);

module.exports = router;