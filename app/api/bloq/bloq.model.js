'use strict';

var mongoose = require('mongoose');

var BloqSchema = new mongoose.Schema({
    type: String,
    name: String,
    connectors: Array,
    bloqClass: String,
    content: Array,
    code: String,
    returnType:{},
    headerText:String,
    descriptionText:String,
    createDynamicContent:{}
}, {
    timestamps: true
});



module.exports = mongoose.model('Bloq', BloqSchema);
