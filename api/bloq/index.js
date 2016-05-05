'use strict';

var express = require('express'),
    controller = require('./bloq.controller'),
    auth = require('../../components/auth/auth.service'),
    router = express.Router();

router.get('/', controller.get);
router.delete('/all', auth.hasRole('admin'), controller.deleteAll);

module.exports = router;