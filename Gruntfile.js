'use strict';
/*jshint camelcase: false */

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
    grunt.registerTask('generateGCSConfig', 'Configure data files', function(env) {

        var environment = env || 'qa',
            configJSON,
            file;

        switch (environment) {
            case 'production':
                configJSON = process.env.BITBLOQ_PROD_CONFIG_GCS;
                file = 'app/res/config/bitbloq-bq-contacts.json';
                break;
            case 'qa':
            default:
                configJSON = process.env.BITBLOQ_QA_CONFIG_GCS;
                file = 'app/res/config/bitbloq-dev-bq-contacts.json';
        }

        grunt.file.write(file, configJSON);
    });
};
