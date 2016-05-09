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
            'generateS3Config:' + environment,
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

        var file = 'config/config.js';

        grunt.file.write(file, configJSON);
    });

    grunt.registerTask('generateS3Config', 'Configure data files', function(env) {

        var environment = env || 'local',
            configJSON;

        switch (environment) {
            case 'production':
                configJSON = process.env.BITBLOQ_PROD_CONFIG_S3;
                break;
            case 'qa':
                configJSON = process.env.BITBLOQ_QA_CONFIG_S3;
                break;
            default:
                configJSON = process.env.BITBLOQ_LOCAL_CONFIG_S3;
        }

        var file = 'config/.env';

        grunt.file.write(file, configJSON);
    });
};
