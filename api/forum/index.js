'use strict';

var express = require('express'),
    controller = require('./forum.controller'),
    auth = require('../../components/auth/auth.service');

var router = express.Router();

// DELETE
router.delete('/answer/:id/:threadid/:categoryid', auth.hasRole('admin'), controller.destroyAnswer);
router.delete('/thread/:id', auth.hasRole('admin'), controller.destroyThread);

// GET
router.get('/', controller.getForumIndex);
router.get('/category/:category', controller.getCategory);
router.get('/thread/:id', controller.getThread);

// HEAD
router.head('/threadStats/views/:id', auth.isAuthenticated(), controller.updateThreadViews);

// POST
router.post('/category', auth.hasRole('admin'), controller.createCategory);
router.post('/thread', auth.isAuthenticated(), controller.createThread);
router.post('/answer', auth.isAuthenticated(), controller.createAnswer);

// PUT
router.put('/thread/:id', auth.isAuthenticated(), controller.updateThread);
router.put('/answer/:id', auth.isAuthenticated(), controller.updateAnswer);

module.exports = router;
