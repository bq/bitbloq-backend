'use strict';

var express = require('express'),
    controller = require('./kit.controller.js'),
    router = express.Router();

router.get('/', controller.get);
router.get('/populate', controller.getPopulado);

module.exports = router;
