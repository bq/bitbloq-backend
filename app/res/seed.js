/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
/*jshint -W109 */

'use strict';
var User = require('../api/user/user.model');
var Project = require('../api/project/project.model');
var Version = require('../api/version/version.model');
var Token = require('../api/recovery/token.model');


Version.find({}).remove(function() {
    return Version.create({
        backend: '0.0.1',
        frontend: '3.0.0'
    }, function() {
        console.log('finished populating version');
    });
});


User.find({}).remove(function() {
    return User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
    }, {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
    }, function() {
        console.log('finished populating users');
    });
});

Token.find({}).remove(function() {
    return Token.create({
        "userId": "123456",
        "token": "987654"
    }, function() {
        console.log('finished populating tokens');
    });
});

Project.find({}).remove(function() {
    return Project.create({
        "name": "proyecto1",
        "description": "mi descripcion",
        "code": "mi code",
        "_acl": {
            'user:57164392527b27df52dbe734': {
                permission: 'ADMIN'
            }
        }
    }, {
        "name": "proyecto2",
        "description": "otra mas",
        "code": "codecodecodecode",
        "_acl": {
            'user:57164392527b27df52dbe734': {
                permission: 'READ'
            }
        }
    }, function() {
        console.log('finished populating projects');
    });
});
