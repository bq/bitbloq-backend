'use strict';

var Kit = require('./kit.model.js'),
    ComponentFunctions = require('../component/component.functions.js'),
    _ = require('lodash'),
    async = require('async');

exports.getAll = function(next) {
    Kit.find({}, next);
};

exports.getAllWithoutDevelopment = function(next) {
    Kit.find({})
        .where('underDevelopment').in([false, undefined, null])
        .exec(next);
};

exports.includedInKits = function(component, kitUuids, next) {
    ComponentFunctions.getByUuid(component.uuid, function(err, component) {
        Kit.find({})
            .where('uuid').in(kitUuids)
            .exec(function(err, kits) {
                if (err) {
                    next(err);
                } else if (kits.length > 0) {
                    async.map(kits, function(kit, callback) {
                        kit.components.push(component._id);
                        kit.components = _.uniqWith(kit.components, _.isEqual);
                        kit.save(callback);
                    }, next);
                } else {
                    next();
                }
            });
    });
};

exports.createKit = function(newKit, next) {
    Kit.findOne({uuid: newKit.uuid}, function(err, kit) {
        if (err) {
            next(err);
        } else if (kit) {
            _.extend(kit, newKit);
            kit.save(next);
        } else {
            Kit.create(newKit, next);
        }
    });
};