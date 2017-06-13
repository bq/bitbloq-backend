'use strict';

var Board = require('./board.model.js'),
    _ = require('lodash'),
    async = require('async');

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


exports.getBoardIdsByUuids = function(uuids, next) {
    if (uuids.length > 0) {
        Board.find({})
            .where('uuid').in(uuids)
            .select('_id')
            .exec(function(err, boards) {
                if (boards.length > 0) {
                    next(err, _.map(boards, '_id'));
                } else {
                    next(err, []);
                }
            });
    } else {
        next(null, []);
    }
};


exports.integratedInBoard = function(integratedBoards, next) {
    var integratedBoardsUuids = _.keys(integratedBoards);
    Board.find({})
        .where('uuid').in(integratedBoardsUuids)
        .exec(function(err, boards) {
            if (err) {
                next(err);
            } else if (boards.length > 0) {
                boards.forEach(function(board) {
                    board.integratedComponents.push(integratedBoards[board.uuid]);
                    board.integratedComponents = _.uniqBy(board.integratedComponents, 'uid');
                    board.save(next);
                });
            } else {
                next(err);
            }
        });
};


exports.compatibleWithBoard = function(component, compatibleBoardUuids, next) {
    Board.find({})
        .where('uuid').in(compatibleBoardUuids)
        .exec(function(err, boards) {
            if (err) {
                next(err);
            } else if (boards) {
                if (err) {
                    next(err);
                } else if (boards.length > 0) {
                    async.map(boards, function(board, callback) {
                        board.availableComponents.push(component.uuid);
                        board.availableComponents = _.uniq(board.availableComponents);
                        board.save(callback);
                    }, next);
                } else {
                    next();
                }
            } else {
                next(err);
            }
        });
};


exports.createBoard = function(newBoard, next) {
    Board.findOne({uuid: newBoard.uuid}, function(err, board) {
        if (err) {
            next(err);
        } else if (board) {
            _.extend(board, newBoard);
            board.save(next);
        } else {
            Board.create(newBoard, next);
        }
    });
};