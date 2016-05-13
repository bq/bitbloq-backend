'use strict';

var express = require('express'),
    controller = require('./robotsFrimware.controller.js'),
    auth = require('../../components/auth/auth.service'),
    router = express.Router();

router.get('/:robot/:version', controller.get);

router.post('/:robot/:version', auth.hasRole('admin'), controller.create);
router.delete('/:robot/:version', auth.hasRole('admin'), controller.delete);

module.exports = router;
