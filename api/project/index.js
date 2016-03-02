'use strict';

var express = require('express');
var controller = require('./project.controller');
var auth = require('../../components/auth/auth.service');

var router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);
//router.get('/me', controller.me);
//router.put('/:id', controller.update);

module.exports = router;
