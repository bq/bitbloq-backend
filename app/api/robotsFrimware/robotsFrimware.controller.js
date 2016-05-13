'use strict';

var Faq = require('./robotsFrimware.model.js');

var perPage = 20;

/**
 * Get public Faq list
 */
exports.get = function(req, res) {

    var robot = req.params.robot,
        version = req.params.version;

    //path -> robot/version

   // res.sendFile(path.join(__dirname, '../public', 'index1.html'), 'binary');

};

exports.create = function(req, res) {
    //todo
};

exports.delete = function(req, res) {
    //todo
};
