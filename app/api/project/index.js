'use strict';

var express = require('express'),
    controller = require('./project.controller.js'),
    auth = require('../../components/auth/auth.service');

var router = express.Router();

router.get('/', controller.getPublished);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/shared', auth.isAuthenticated(), controller.sharedWithMe);
router.get('/trash', auth.isAuthenticated(), controller.getTrash);
router.get('/:id', auth.getUser(), controller.show);

router.post('/', auth.isAuthenticated(), controller.create);
router.post('/all', auth.hasRole('admin'), controller.createAll);

router.put('/:id/private', auth.isAuthenticated(), controller.private);
router.put('/:id/publish', auth.isAuthenticated(), controller.publish);
router.put('/:id/share', auth.isAuthenticated(), controller.share);
router.put('/:id/clone', auth.isAuthenticated(), controller.clone);
router.put('/:id/download', auth.getUser(), controller.download);
router.put('/:id/restore', auth.getUser(), controller.restore);
router.put('/:id', auth.isAuthenticated(), controller.update);

router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
