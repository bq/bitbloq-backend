'use strict';

var express = require('express'),
    controller = require('./hardware.controller.js'),
    auth = require('../../components/auth/auth.service');

var router = express.Router();

router.get('/', controller.getAllHardware);

router.post('/', auth.hasRole('admin'), controller.insertHardware);

module.exports = router;
