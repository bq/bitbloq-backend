'use strict';

var express = require('express'),
    controller = require('./notification.controller.js'),
    auth = require('../../components/auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.getNotifications);

router.post('/', controller.create);//auth.hasRole('admin'), 

module.exports = router;
