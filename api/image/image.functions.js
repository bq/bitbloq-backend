'use strict';

var FUS3 = require('fetch-upload-s3');

var fus3 = new FUS3('qa-bitbloq.com/api-images/avatar');

exports.uploadToS3FromUrl = function(ImageUrl, s3ImageId) {
    // For fetch url :
    fus3.init(function() {
        fus3.do(ImageUrl, s3ImageId, function(err, data) {
            console.log('file uploaded to S3!');
            console.log("err");
            console.log(err);
        });
    });
}
