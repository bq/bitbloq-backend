'use strict';

var FUS3 = require('fetch-upload-s3'),
    multer = require('multer'), //for handling multipart/form-data;
    s3 = require('multer-storage-s3');

var fus3 = new FUS3('qa-bitbloq.com/api-images/avatar'),
    storage = s3({
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


exports.uploadToS3FromUrl = function(ImageUrl, s3ImageId) {
    // For fetch url :
    fus3.init(function() {
        fus3.do(ImageUrl, s3ImageId, function(err, data) {
            console.log('file uploaded to S3!');
            console.log("err");
            console.log(err);
        });
    });
};
