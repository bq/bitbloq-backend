'use strict';

var express = require('express'),
    config = require('../../res/config.js'),
    User = require('../../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local/index'));

module.exports = router;
