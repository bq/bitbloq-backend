'use strict';

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
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
};

/**
 * Return a valid http error code from the error
 * @param  {Object}  err
 * @return {Number} errorCode
 */
exports.getValidHttpErrorCode = function(err) {
    var errorCode;
    if (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) {
        errorCode = parseInt(err.code);
    } else {
        errorCode = 500;
    }
    return errorCode;
};
