'use strict';

var express = require('express');
var controller = require('./project.controller');
var auth = require('../../components/auth/auth.service');

var router = express.Router();

router.get('/', controller.getAll);
router.get('/me', controller.me);
router.get('/:id', controller.show);

router.post('/', controller.create);

router.put('/:id/private', controller.private);
router.put('/:id/publish', controller.publish);
router.put('/:id/share', controller.share);
router.put('/:id', controller.update);

router.delete('/:id', controller.destroy);

module.exports = router;
