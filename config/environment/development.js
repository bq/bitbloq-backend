'use strict';

// Development specific configuration
// ==================================
module.exports = {
    DOMAIN: 'http://localhost:8000',
    CLIENT_DOMAIN: 'http://localhost:9000',
    // MongoDB connection options
    mongo: {
        uri: 'mongodb://MONGO_URL/bitbloq-server-dev'
    },
    mailer: {
        auth: {
            user: 'bitbloqtest',
            pass: 'BitbloqTest123$'
        },
        defaultFromAddress: 'Bitbloq Test <bitbloqtest@gmail.com>'
    },

    // Seed database on startup
    seedDB: false

};
