'use strict';

var express = require('express'),
    controller = require('./feedback.controller');

var router = express.Router();

router.post('/', controller.create);

module.exports = router;
