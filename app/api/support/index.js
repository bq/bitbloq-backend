'use strict';

var express = require('express'),
    controller = require('./support.controller.js'),
    auth = require('../../components/auth/auth.service');

var router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.show);
router.get('/p/:id', controller.showPermalink);

router.post('/', auth.hasRole('admin'), controller.create);
router.post('/massive/', auth.hasRole('admin'), controller.massive);

router.put('/:id', auth.hasRole('admin'), controller.update);
router.put('/p/:id', auth.hasRole('admin'), controller.updatePermalink);

router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
