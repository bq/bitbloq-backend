/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var User = require('../api/user/user.model');
var Project = require('../api/project/project.model');

return User.find({}).removeAsync()
  .then(function() {
    return User.createAsync({
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
      })
      .then(function() {
        console.log('finished populating users');
      });
  });


return Project.find({}).removeAsync()
  .then(function() {
    return Project.createAsync({
        "name" : "proyecto1",
        "description" : "mi descripcion",
        "code" : "mi code"
      },
      {
        "name" : "proyecto2",
        "description" : "otra mas",
        "code" : "codecodecodecode"
      })
      .then(function() {
        console.log('finished populating projects');
      });
  });
