'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BloqSchema = new mongoose.Schema({
    type : String,
    name : "String",
    connectors : Array,
    bloqClass : String,
    content : Array,
    code : String,
    _createdAt : Date,
    _updatedAt : Date
});


module.exports = mongoose.model('Bloq', BloqSchema);
