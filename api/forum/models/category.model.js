'use strict';

var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    name: { type: String, lowercase: false, trim: true, required: true },
    uuid: { type: String, lowercase: true, trim: true },
    section: { type: String, lowercase: true, trim: true, required: true },
    description: { type: String, lowercase: false, trim: false },
    order: { type: Number, min: 0, max: 1000 },
    _createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

/**
 * Validations
 */

// Validate unique name
CategorySchema
    .path('name')
    .validate(function(name, next) {
        this.constructor.findOne({
            name: name
        }, function(err, category) {
            if(err){
                next(err);
            } else if (category) {
                next(409);
            } else {
                next();
            }
        });
    }, 'Category name already in use');

module.exports = mongoose.model('Category', CategorySchema);
