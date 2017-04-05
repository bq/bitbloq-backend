'use strict';

var Board = require('./board.model.js');

exports.getAll = function(next) {
    Board.find({}, next);
};

exports.getAllWithoutDevelopment = function(next) {
    Board.find({})
        .where('underDevelopment').in([false, undefined, null])
        .exec(next);
};