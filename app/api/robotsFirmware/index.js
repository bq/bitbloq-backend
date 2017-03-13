'use strict';

var express = require('express'),
    controller = require('./robotsFirmware.controller.js'),
    auth = require('../../components/auth/auth.service'),
    router = express.Router();

router.get('/:robot/:version', controller.get);

module.exports = router;
