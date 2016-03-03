'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ProjectSchema = new mongoose.Schema({
  name: String,
  creatorId: String,
  description: String,
  imageType: String,
  videoUrl: String,
  code: String,
  _acl: {}
});


var thereIsAdmin = function(project) {
  var admin = false;
  if (project._acl) {
    project._acl.forEach(function(item) {
      if (item.permission === 'ADMIN') {
        admin = true;
      }
    });
  }
  return admin;
};


var setUserAdmin = function(project, userId) {
  project._acl = project._acl || {};
  project._acl['user:' + userId] = {
    permission: 'ADMIN',
    properties: {}
  };
};

/**
 * Pre-save hook
 */
ProjectSchema
  .pre('save', function(next) {
    if (!thereIsAdmin(this)) {
      setUserAdmin(this, this.creatorId);
      next(this);
    } else {
      next();
    }
  });


/**
 * Methods
 */

ProjectSchema.methods = {

  /**
   * SetPublic - set acl value to public access
   *
   * @param {Object} user
   * @api public
   */
  setPublic: function() {
    if (!thereIsAdmin(this)) {
      setUserAdmin(this, this.creatorId);
    }
    this._acl.ALL = {
      "permission": "READ",
      "properties": {
        "date": new Date()
      }
    }
  },


  /**
   * setPrivate - set acl value to private access
   *
   * @param {String} user
   * @api public
   */
  setPrivate: function() {
    delete this._acl.ALL;
  }
};

module.exports = mongoose.model('Project', ProjectSchema);
