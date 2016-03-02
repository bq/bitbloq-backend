'use strict';

var crypto = require('crypto');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  creatorId: String,
  description: String,
  imageType: String,
  videoUrl: String,
  code: String
});

module.exports = mongoose.model('Project', ProjectSchema);
