'use strict';

var request = require('request'),
    gcloud = require('gcloud'),
    config = require('../../res/config/config'),
    storage = gcloud.storage(config.gcloud),
    bucket = storage.bucket(config.cloudStorageBucket);


exports.downloadAndUploadImage = function(sourceUrl, destFileName){

var file = bucket.file(destFileName);
var opts = { metadata: { cacheControl: 'private, max-age=0, no-transform' } };
request
  .get(sourceUrl)
  .on('error', function(err){
    console.log('Could not fetch image ' + sourceUrl, err);
  })
  .pipe(file.createWriteStream(opts))
  .on('finish', function(){
    console.log('Upload image ' + destFileName);
  })
  .on('error', function(err){
    console.log('Could not upload image', err);
  })
}

exports.getPublicUrl = function(filename) {
  return 'https://storage.googleapis.com/' +
    config.cloudStorageBucket + '/' + filename;
}



/*
var FUS3 = require('fetch-upload-s3'),
    AWS = require('aws-sdk');


var fus3 = new FUS3('qa-bitbloq.com/api-images/avatar'),
    s3 = new AWS.S3();


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

*/

/**
 * Delete an image
 */

 /*
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

*/
