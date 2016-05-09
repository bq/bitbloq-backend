'use strict';

var express = require('express'),
    controller = require('./image.controller.js'),
    auth = require('../../components/auth/auth.service'),
    multer = require('multer'), //for handling multipart/form-data;
    s3 = require('multer-storage-s3');

var storage = s3({
    destination: function(req, file, cb) {
        cb(null, 'api-images/' + req.params.collection);

    },
    filename: function(req, file, cb) {
        cb(null, req.params.id);
    }
});

var multerObject = multer({
    storage: storage
});

var router = express.Router();

router.post('/:collection/:id', auth.isAuthenticated(), multerObject.single('file'), controller.create);

module.exports = router;
