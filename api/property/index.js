'use strict';

var express = require('express'),
    controller = require('./property.controller');

var router = express.Router();

router.get('/', controller.getAll);

module.exports = router;
