'use strict';

var express = require('express');
var controller = require('./bloq.controller');

var router = express.Router();

router.get('/', controller.getAll);

module.exports = router;
