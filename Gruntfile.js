'use strict';
/*jshint camelcase: false */

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
    grunt.registerTask('generateConfigFiles', 'Configure data files', function(env) {
        var environment = env || 'local';

        grunt.task.run([
            'generateDevelopmentConfig:' + environment,
            'generateS3Config:' + environment
        ]);
    });

    grunt.registerTask('generateDevelopmentConfig', 'Configure data files', function(env) {

        var environment = env || 'local',
            configJSON;

        switch (environment) {
            case 'production':
                configJSON = process.env.BITBLOQ_PROD_CONFIG_API;
                break;
            case 'qa':
                configJSON = process.env.BITBLOQ_QA_CONFIG_API;
                break;
            default:
                configJSON = process.env.BITBLOQ_LOCAL_CONFIG_API;

        }

        var file = 'app/res/config/config.json';

        grunt.file.write(file, configJSON);
    });

    grunt.registerTask('generateGCSConfig', 'Configure data files', function(env) {

        var environment = env || 'local',
            configJSON,
            file;

        switch (environment) {
            case 'production':
                configJSON = process.env.BITBLOQ_PROD_CONFIG_GCS;
                file = 'app/res/config/bitbloq-bq-contacts.json';
                break;
            case 'qa':
                configJSON = process.env.BITBLOQ_QA_CONFIG_GCS;
                file = 'app/res/config/bitbloq-dev-bq-contacts.json';
                break;
            default:
                configJSON = process.env.BITBLOQ_LOCAL_CONFIG_GCS;
                file = 'app/res/config/bitbloq-dev-bq-contacts.json';
        }

        grunt.file.write(file, configJSON);
    });
};
