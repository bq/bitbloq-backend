'use strict';

exports.validationError = function(res, statusCode, error) {
    statusCode = statusCode || 422;
    if(error){
        res.status(statusCode).send(error);
    } else {
        return function(err) {
            res.status(statusCode).send(err);
        };
    }
};

exports.handleError = function(res, statusCode, error) {
    statusCode = statusCode || 500;
    if(error){
        res.status(statusCode).send(error);
    } else {
        return function(err) {
            res.status(statusCode).send(err);
        };
    }
};


/**
 * Extend a given object with all the properties in passed-in object(s).
 * @param  {Object}  obj
 * @return {Object}
 */
exports.extend = function(obj) {

    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });

    return obj;
};


/**
 * Check if a object is empty
 * @param  {Object}  obj
 * @return {Boolean}
 */
exports.isEmpty = function(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
};
