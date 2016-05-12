'use strict';

var express = require('express'),
    controller = require('./image.controller'),
    auth = require('../../components/auth/auth.service');


var router = express.Router();

router.post('/:collection/:id', auth.isAuthenticated(), controller.multerObject.single('file'), controller.create);

module.exports = router;

