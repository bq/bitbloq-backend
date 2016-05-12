'use strict';

var FUS3 = require('fetch-upload-s3'),
    AWS = require('aws-sdk');


var fus3 = new FUS3('qa-bitbloq.com'),
    s3 = new AWS.S3();


exports.uploadToS3FromUrl = function(ImageUrl, s3ImageId) {
    // For fetch url :
    fus3.init(function() {
        fus3.do(ImageUrl, 'api-images/avatar/' + s3ImageId, function(err, data) {
            console.log('file uploaded to S3!');
            console.log("err");
            console.log(err);
        });
    });
};


/**
 * Delete an image
 */
exports.delete = function(collection, id, next) {
    var params = {
        Bucket: 'qa-bitbloq.com',
        Delete: {
            Objects: [
                {Key: 'api-images/' + collection + '/' + id}
            ]
        }
    };

    s3.deleteObjects(params, next);
};
