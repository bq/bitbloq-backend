'use strict';

var Board = require('./board.model.js');

exports.getAll = function(next) {
    Board.find({}, next);
};