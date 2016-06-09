'use strict';

var request = require('request'),
    gcloud = require('gcloud'),
    config = require('../../res/config/config'),
    storage = gcloud.storage(config.gcloud),
    bucket = storage.bucket(config.cloudStorageBucket);

exports.downloadAndUploadImage = function(sourceUrl, destFileName, next) {

    var file = bucket.file(destFileName);
    var opts = {
        metadata: {
            cacheControl: 'private, max-age=0, no-transform'
        }
    };
    request
        .get(sourceUrl)
        .on('error', function(err) {
            console.log('Could not fetch image ' + sourceUrl, err);
        })
        .pipe(file.createWriteStream(opts))
        .on('finish', function() {
            console.log('Upload image ' + destFileName);
            if (next) {
                next();
            }
        })
        .on('error', function(err) {
            console.log('Could not upload image', err);
        })
};

exports.getPublicUrl = function(filename) {
    return 'https://storage.googleapis.com/' +
        config.cloudStorageBucket + '/' + filename;
};

exports.delete = function(folder, imageId, next) {
    bucket.deleteFiles({
        prefix: 'images/' + folder + '/' + imageId
    }, function(err) {
        if (err) {
            console.log('Error: delete image');
            console.log(err);
        }
        if (next) {
            next();
        }
    });
};

exports.cloneImages = function(oldId, newId, next) {
    var file = bucket.file('images/project/' + oldId);
    file.copy('images/project/' + newId, function(err) {
        if (err) {
            console.log('Error: clone image');
            console.log(err);
        }
        if (next) {
            next();
        }
    });
};
