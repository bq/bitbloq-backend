'use strict';

var express = require('express'),
    controller = require('./mailer.controller');

var router = express.Router();

router.post('/', controller.sendEmail);

module.exports = router;
