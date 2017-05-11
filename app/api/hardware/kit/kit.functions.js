'use strict';

var Kit = require('./kit.model.js');

exports.getAll = function(next) {
    Kit.find({}, next);
};

exports.getAllWithoutDevelopment = function(next) {
    Kit.find({})
        .where('underDevelopment').in([false, undefined, null])
        .exec(next);
};