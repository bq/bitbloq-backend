'use strict';

var Component = require('./component.model.js'),
    _ = require('lodash');

exports.getAll = function(next) {
    Component.find({}, next);
};

exports.getAllWithoutDevelopment = function(next) {
    Component.find({})
        .where('underDevelopment').in([false, undefined, null])
        .exec(next);
};

exports.getComponentsInArray = function(arrayId, next) {
    if (arrayId.length > 0) {
        Component.find({})
            .where('_id').in(arrayId)
            .exec(next);
    } else {
        next(null, []);
    }
};

exports.createComponent = function(newComponent, next) {
    Component.findOne({uuid: newComponent.uuid}, function(err, component) {
        if (err) {
            next(err);
        } else if (component) {
            _.extend(component, newComponent);
            component.save(next);
        } else {
            Component.create(component, next);
        }
    });
};

exports.getByUuid = function(uuid, next) {
    Component.findOne({uuid: uuid}, next);
};