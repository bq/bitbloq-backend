'use strict';

var Kit = require('./kit.model.js');

exports.getAll = function(next) {
    Kit.find({}, next);
};
