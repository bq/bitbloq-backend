'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ProjectSchema = new mongoose.Schema({
    creatorId: String,
    name: String,
    description: String,
    imageUrl: String,
    videoUrl: String,
    code: String,
    codeProject: Boolean,
    timesViewed: { type: Number, default: 0 },
    timesAdded: { type: Number, default: 0 },
    defaultTheme: { type: String, default: 'infotab_option_colorTheme' },
    hardware: {
        board: String,
        components: Array,
        connections: Array,
        robot: Array
    },
    "software" : {
        "vars" : Object,
        "setup" : Object,
        "loop" : Object
    },
    hardwareTags: Array,
    userTags: Array,
    _acl: Object
});

/**
 * Virtuals
 */

// Public profile information
ProjectSchema
    .virtual('profile')
    .get(function() {
        return {
            '_id': this._id,
            'name': this.name,
            'description': this.description,
            'imageUrl': this.imageUrl,
            'videoUrl': this.videoUrl,
            'timesViewed': this.timesViewed || 0,
            'timesAdded': this.timesAdded || 0
        };
    });


/**
 * Pre-save hook
 */
ProjectSchema
    .pre('save', function(next) {
        console.log('PRE SAVE');
        if (!thereIsAdmin(this)) {
            setUserAdmin(this, this.creatorId);
            next(this);
        } else {
            next();
        }
    });


/**
 * Private functions
 */

var thereIsAdmin = function(project) {
    var admin = false;
    if (project._acl) {
        var aux = project._acl;
        for (var item in project._acl) {
            if (project._acl[item].permission === 'ADMIN') {
                admin = true;
            }
        }

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
 * Methods
 */

ProjectSchema.methods = {

    /**
     * SetPublic - set acl value to public access
     *
     * @api public
     */
    setPublic: function() {
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
     * @api public
     */
    setPrivate: function() {
        delete this._acl.ALL;
    },


    /**
     * addView - add a visit to project
     *
     * @api public
     */
    addView: function() {
        if(this.timesViewed) {
            this.timesViewed++;
        } else {
            this.timesViewed = 0;
        }
    }
};

module.exports = mongoose.model('Project', ProjectSchema);
