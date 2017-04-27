'use strict';

var Board = require('./board.model.js'),
    mongoose = require('mongoose');

exports.getAll = function(next) {
    Board.find({})
        .sort({
            order: 'asc'
        })
        .exec(next);
};

exports.getAllWithoutDevelopment = function(next) {
    Board.find({})
        .where('underDevelopment').in([false, undefined, null])
        .sort({
            order: 'asc'
        })
        .exec(next);
};

exports.getBoardsInArray = function(arrayId, next) {
    if (arrayId.length > 0) {
        Board.find({})
            .where('_id').in([arrayId])
            .sort({
                order: 'asc'
            })
            .exec(next);
    } else {
        next(null, []);
    }
};
