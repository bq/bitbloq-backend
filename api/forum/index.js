'use strict';

var express = require('express');
var controller = require('./forum.controller');
var auth = require('../../components/auth/auth.service');

var router = express.Router();

// DELETE
router.delete('/answer/:id', auth.hasRole('admin'), controller.destroyAnswer);
router.delete('/thread/:id', auth.hasRole('admin'), controller.destroyThread);

// GET
router.get('/', controller.showForumIndex);
router.get('/category/:id', controller.showThreadsInCategory);
router.get('/thread/:id', controller.showThread);
router.get('/answers/:thread', controller.showAnswersInThread);

// HEAD

// POST
router.post('/category', controller.createCategory);
router.post('/thread', controller.createThread);
router.post('/answer', controller.createAnswer);

// PUT
router.put('/thread/:id', auth.isAuthenticated(), controller.updateThread);
router.put('/answer/:id', auth.isAuthenticated(), controller.updateAnswer);

module.exports = router;