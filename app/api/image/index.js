'use strict';

var express = require('express'),
    controller = require('./image.controller'),
    auth = require('../../components/auth/auth.service'),
    imageFunctions = require('./image.functions');


var router = express.Router();

router.post('/:collection/:id', auth.isAuthenticated(), imageFunctions.multerObject.single('file'), controller.create);

module.exports = router;
