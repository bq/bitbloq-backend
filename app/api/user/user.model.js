/* global Buffer */
'use strict';

var crypto = require('crypto'),
    mongoose = require('mongoose'),
    ProjectFunctions = require('../project/project.functions.js');

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
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
        trim: true,
        required: true
    },
    bannedInForum: {
        type: Boolean,
        default: false
    },
    social: {
        google: {
            id: {
                type: String,
                default: ''
            }
        },
        facebook: {
            id: {
                type: String,
                default: ''
            }
        }
    },
    twitterApp: {
        consumerKey: String,
        consumerSecret: String,
        accessToken: String,
        accessTokenSecret: String
    },
    role: {
        type: String, // user | admin
        default: 'user'
    },
    birthday: {
        type: Date
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    chromeapp: {
        type: Boolean,
        default: false
    },
    seeBoardsUnderDevelopment: {
        type: Boolean,
        default: false
    },
    language: {
        type: String,
        default: 'es-ES'
    },
    cookiePolicyAccepted: Boolean,
    takeTour: {
        type: Boolean,
        default: false
    },
    hasBeenAskedIfTeacher: {
        type: Boolean,
        default: false
    },
    isMobileConnected: {
        type: Boolean,
        default: false
    },
    hasDownloadedApp: {
        type: Boolean,
        default: false
    },
    hasFirstComponent: {
        type: Boolean,
        default: false
    },
    hasBeenWarnedAboutChangeBloqsToCode: {
        type: Boolean,
        default: false
    },
    isTeacher: Boolean,
    password: String,
    salt: String,
    corbelHash: {
        type: Boolean
    },
    needValidation: {
        type: Boolean
    },
    tutor: {
        dni: String,
        firstName: String,
        lastName: String,
        email: String,
        validation: {
            date: Date,
            result: Boolean
        }
    },
    anonymous: String,
    studentMode: {
        type: Boolean,
        default: false
    },
    centers : {} // CenterId : {date, role: headMaster | teacher | student}
}, {
    timestamps: true
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
                    id: this.social.google.id
                },
                'facebook': {
                    id: this.social.facebook.id
                }
            },
            'googleEmail': this.googleEmail,
            'facebookEmail': this.facebookEmail,
            'bannedInForum': this.bannedInForum,
            'newsletter': this.newsletter,
            'chromeapp': this.chromeapp,
            'seeBoardsUnderDevelopment': this.seeBoardsUnderDevelopment,
            'isTeacher': this.isTeacher,
            'language': this.language,
            'cookiePolicyAccepted': this.cookiePolicyAccepted,
            'hasBeenAskedIfTeacher': this.hasBeenAskedIfTeacher,
            'hasBeenWarnedAboutChangeBloqsToCode': this.hasBeenWarnedAboutChangeBloqsToCode,
            'hasFirstComponent': this.hasFirstComponent,
            'takeTour': this.takeTour,
            'hasBeenValidated': this.hasBeenValidated,
            'centers': this.centers,
            'studentMode': this.studentMode,
            'hasDownloadedApp' : this.hasDownloadedApp,
            'isMobileConnected': this.isMobileConnected,
            'twitterApp': {
                consumerKey: this.twitterApp.consumerKey,
                consumerSecret: this.twitterApp.consumerSecret,
                accessToken: this.twitterApp.accessToken,
                accessTokenSecret: this.twitterApp.accessTokenSecret
            }
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

// Public tutor information
UserSchema
    .virtual('tutorProfile')
    .get(function() {
        return {
            'hasBeenValidated': this.hasBeenValidated,
            'tutor': this.tutor
        };
    });

/**
 * Validations
 */

// Validate empty password if present
UserSchema
    .path('password')
    .validate(function(password) {
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
        return this.constructor.findOne(query, function(err, user) {
            var result = false;
            if (!user || (user && self.id === user.id)) {
                result = true;
            }
            return respond(result);
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
            var result = false;
            if (!user || (user && self.id === user.id)) {
                result = true;
            }
            return respond(result);
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
                } else {
                    _this.salt = salt;
                    _this.encryptPassword(_this.password, function(encryptErr, hashedPassword) {
                        if (encryptErr) {
                            next(encryptErr);
                        }
                        _this.password = hashedPassword;
                        next();
                    });
                }

            });
        } else {
            next();
        }
    });

UserSchema
    .pre('validate', function(next) {
        // Handle birthday
        if (this.isValidated()) {
            next();
        } else {
            next({
                code: 404,
                message: 'Not Found'
            });
        }
    });

UserSchema
    .pre('validate', function(next) {
        // Handle new/update role
        if (this.role !== 'user' && this.isModified('role')) {
            this.invalidate('role');
            next({
                code: 401,
                message: 'Internal Server Error'
            });
        } else {
            next();
        }
    });

UserSchema
    .pre('validate', function(next) {
        // Handle new/update passwords
        if (this.isModified('bannedInForum')) {
            this.invalidate('bannedInForum');
            next({
                code: 401,
                message: 'Internal Server Error'
            });
        } else {
            next();
        }
    });

UserSchema
    .pre('validate', function(next) {
        // Handle new/update passwords
        if (this.needValidation) {
            this.bannedInForum = true;
        }
        next();
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
            } else {
                if (_this.password === pwdGen) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
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
        if (this.corbelHash) {
            if (callback) {
                callback(null, crypto.createHash('md5').update(password + this.salt).digest('hex'));
            } else {
                return crypto.createHash('md5').update(password + this.salt).digest('hex');
            }

        } else {
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
    },

    /**
     * check if user is validated
     *
     * @param {Object} user
     * @return {Boolean}
     * @api public
     */
    isValidated: function() {
        if (this.anonymous) {
            return false;
        } else {
            if (this.needValidation) {
                var createdDay = new Date(this.createdAt);
                createdDay.setDate(createdDay.getDate() + 15);
                if (createdDay.getTime() < Date.now()) {
                    this.anonymize('rejectInValidation', function() {
                        return false
                    });
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
    },

    anonymize: function(anonText, next) {
        this.firstName = 'anon';
        this.lastName = 'anon';
        this.email = 'anon@anon.com' + Date.now();
        this.username = 'anon' + Date.now();
        this.password = Date.now() * Math.random();
        this.bannedInForum = true;
        this.needValidation = false;
        this.tutor = {
            dni: '',
            firstName: '',
            lastName: '',
            email: '',
            validation: {
                result: false,
                date: Date.now()
            }
        };
        this.social = {
            google: {
                id: ''
            },
            facebook: {
                id: ''
            }
        };
        this.anonymous = anonText;

        var that = this;
        ProjectFunctions.deleteAllByUser(this._id, function(err) {
            if (err) {
                next(err.code);
            } else {
                that.save(next);
            }
        });
    }
};

module.exports = mongoose.model('User', UserSchema);
