'use strict';


var express = require('express'),
    controller = require('./image.controller'),
    auth = require('../../components/auth/auth.service'),
    multer = require('multer'),	//for handling multipart/form-data;
    s3 = require('multer-storage-s3');

require('dotenv').config({path: 'config/.env'});

var storage = s3({
    destination: function(req, file, cb) {
        cb(null, 'api-images');

    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());

    }
});

var multerObject = multer({storage: storage});


var router = express.Router();

router.post('/', auth.isAuthenticated(), multerObject.single('file'), controller.create);

module.exports = router;
