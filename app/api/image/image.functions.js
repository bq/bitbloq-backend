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
};

exports.getPublicUrl = function(filename) {
  return 'https://storage.googleapis.com/' +
    config.cloudStorageBucket + '/' + filename;
};
