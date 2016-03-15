'use strict';

var express = require('express');
var controller = require('./project.controller');
var auth = require('../../components/auth/auth.service');

var router = express.Router();

router.get('/', controller.getAll);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/shared', auth.isAuthenticated(), controller.sharedWithMe);
router.get('/:id', controller.show);

router.post('/', controller.create);

router.put('/:id/private', auth.isAuthenticated(), controller.private);
router.put('/:id/publish', auth.isAuthenticated(), controller.publish);
router.put('/:id/share', auth.isAuthenticated(), controller.share);
router.put('/:id', auth.isAuthenticated(), controller.update);

router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
