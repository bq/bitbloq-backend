'use strict';

var Board = require('./board.model.js'),
    mongoose = require('mongoose');

exports.getAll = function(next) {
    Board.find({}, next);
};

exports.getAllWithoutDevelopment = function(next) {
    Board.find({})
        .where('underDevelopment').in([false, undefined, null])
        .exec(next);
};

exports.getBoardsInArray = function(arrayId, next) {
    if (arrayId.length > 0) {
        Board.find({})
            .where('_id').in([arrayId])
            .exec(next);
    } else {
        next(null, []);
    }
};
