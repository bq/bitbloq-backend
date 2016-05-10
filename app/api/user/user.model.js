/* global Buffer */
'use strict';

var crypto = require('crypto'),
    mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    bannedInForum: {
        type: Boolean,
        default: false
    },
    social: {
        google: {
            email: {
                type: String,
                lowercase: true,
                trim: true,
                default: ''
            },
        },
        facebook: {
            email: {
                type: String,
                lowercase: true,
                trim: true,
                default: ''
            },
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    newsletter: Boolean,
    language: {
        type: String,
        lowercase: true,
        default: 'es-ES'
    },
    cookiePolicyAccepted: Boolean,
    hasBeenAskedIfTeacher: Boolean,
    hasBeenWarnedAboutChangeBloqsToCode: {
        type: Boolean,
        default: false
    },
    isTeacher: Boolean,
    password: String,
    provider: String,
    salt: String,
    _createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
    .virtual('profile')
    .get(function() {
        return {
            'username': this.username,
            'avatar': this.properties.avatar,
            'role': this.role
        };
    });

// Information for the owner
UserSchema
    .virtual('owner')
    .get(function() {
        return {
            '_id': this._id,
            'firstName': this.firstName,
            'lastName': this.lastName,
            'username': this.username,
            'email': this.email,
            'role': this.role,
            'social': {
                'google': {
                    email: this.social.google.email,
                    id: this.social.google.id
                },
                'facebook': {
                    email: this.social.facebook.email,
                    id: this.social.facebook.id
                }
            },
            'googleEmail': this.googleEmail,
            'facebookEmail': this.facebookEmail,
            'bannedInForum': this.bannedInForum,
            'newsletter': this.newsletter,
            'isTeacher': this.isTeacher,
            'language': this.language,
            'cookiePolicyAccepted': this.cookiePolicyAccepted,
            'hasBeenAskedIfTeacher': this.hasBeenAskedIfTeacher,
            'provider': this.provider
        };
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function() {
        return {
            '_id': this._id,
            'role': this.role
        };
    });

/**
 * Validations
 */

// Validate empty email
UserSchema
    .path('email')
    .validate(function(email) {
        //TODO esto podría ir en atributo en Schema o meterlo abajo....

        return email.length;
    }, 'Email cannot be blank');

// Validate empty password
UserSchema
    .path('password')
    .validate(function(password) {
        //TODO esto podría ir en atributo en Schema....

        return password.length;
    }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
    .path('email')
    .validate(function(value, respond) {
        var self = this;
        var query = this.constructor.where({
            $or: [{
                email: value
            }, {
                google: {
                    email: value
                },
                facebook: {
                    email: value
                }
            }]
        });
        return this.constructor.findOne(query).then(function(user) {
            if (user) {
                if (self.id === user.id) {
                    return respond(true);
                }
                return respond(false);
            }
            return respond(true);
        }).catch(function(err) {
            throw err;
        });
    }, 'The specified email address is already in use.');

// Validate username is not taken
UserSchema
    .path('username')
    .validate(function(value, respond) {
        var self = this;

        this.constructor.findOne({
            username: value
        }, function(err, user) {
            if (user) {
                if (self.id === user.id) {
                    return respond(true);
                }
                return respond(false);
            }
            return respond(true);
        })

    }, 'The specified username is already in use.');

var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function(next) {
        // Handle new/update passwords
        if (this.isModified('password')) {
            if (!validatePresenceOf(this.password)) {
                next(new Error('Invalid password'));
            }

            // Make salt with a callback
            var _this = this;
            this.makeSalt(function(saltErr, salt) {
                if (saltErr) {
                    next(saltErr);
                }
                _this.salt = salt;
                _this.encryptPassword(_this.password, function(encryptErr, hashedPassword) {
                    if (encryptErr) {
                        next(encryptErr);
                    }
                    _this.password = hashedPassword;
                    next();
                });
            });
        } else {
            next();
        }
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */

    authenticate: function(password, callback) {
        if (!callback) {
            return this.password === this.encryptPassword(password);
        }

        var _this = this;
        this.encryptPassword(password, function(err, pwdGen) {
            if (err) {
                callback(err);
            }

            if (_this.password === pwdGen) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    },

    /**
     * Make salt
     *
     * @param {Number} byteSize Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt: function(byteSize, callback) {
        var defaultByteSize = 16;

        if (typeof arguments[0] === 'function') {
            callback = arguments[0];
            byteSize = defaultByteSize;
        } else if (typeof arguments[1] === 'function') {
            callback = arguments[1];
        }

        if (!byteSize) {
            byteSize = defaultByteSize;
        }

        if (!callback) {
            return crypto.randomBytes(byteSize).toString('base64');
        }

        return crypto.randomBytes(byteSize, function(err, salt) {
            if (err) {
                callback(err);
            }
            return callback(null, salt.toString('base64'));
        });
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword: function(password, callback) {
        if (!password || !this.salt) {
            return null;
        }

        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');

        if (!callback) {
            return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, function(err, key) {
            if (err) {
                callback(err);
            }
            return callback(null, key.toString('base64'));
        });
    }
};

module.exports = mongoose.model('User', UserSchema);