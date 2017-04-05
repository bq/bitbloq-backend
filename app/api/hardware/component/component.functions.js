'use strict';

var Component = require('./component.model.js');

exports.getAll = function(next) {
    Component.find({}, next);
};
