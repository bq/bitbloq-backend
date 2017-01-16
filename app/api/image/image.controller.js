'use strict';

var gcloud = require('gcloud'),
    ImageFunctions = require('./image.functions.js'),
    config = require('../../res/config/config'),
    storage = gcloud.storage(config.gcloud),
    bucket = storage.bucket(config.cloudStorageBucket);

exports.multerObject = require('multer')({
    inMemory: true,
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
    rename: function(fieldname, filename) {
        // generate a unique filename
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    }
});

exports.sendUploadToGCS = function(req, res, next) {
    if (!req.file) {
        return next();
    }

    var gcsname = req.params.id;
    var file = bucket.file('images/' + req.params.collection + '/' + gcsname);
    var opts = {
        metadata: {
            cacheControl: 'private, max-age=0, no-transform'
        }
    };
    var stream = file.createWriteStream(opts);

    stream.on('error', function(err) {
        req.file.cloudStorageError = err;
        console.log(err);
        err.code = parseInt(err.code) || 500;
        res.status(err.code).send(err);
    });

    stream.on('finish', function() {
        req.file.cloudStorageObject = gcsname;
        req.file.cloudStoragePublicUrl = ImageFunctions.getPublicUrl(gcsname);
        res.sendStatus(200);
    });

    stream.end(req.file.buffer);
};
