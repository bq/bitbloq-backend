'use strict';

var express = require('express'),
    controller = require('./mailer.controller.js');

var router = express.Router();

router.post('/', controller.sendEmail);

module.exports = router;
