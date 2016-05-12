'use strict';


var multer = require('multer'), //for handling multipart/form-data;
    s3Storage = require('multer-storage-s3');

var storage = s3Storage({
    destination: function(req, file, cb) {
        cb(null, 'api-images/' + req.params.collection);

    },
    filename: function(req, file, cb) {
        cb(null, req.params.id);
    }
});

exports.multerObject = multer({
    storage: storage
});


/**
 * Create a new image
 */
exports.create = function(req, res) {
    res.sendStatus(200);
};


