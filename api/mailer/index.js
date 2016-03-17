'use strict';

var express = require('express');
var controller = require('./mailer.controller');

var router = express.Router();

router.post('/', controller.sendEmail);

module.exports = router;