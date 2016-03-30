/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// var User = require('../api/user/user.model');
// var Project = require('../api/project/project.model');
var Category = require('../api/forum/models/category.model');

return Category.find({}).removeAsync()
    .then(function() {
        return Category.createAsync({
                "name": "exposición",
                "uuid": "forum_category_expo",
                "section": "forum_section_2_projects",
                "description": "enséñanos tus mejores proyectos.",
                "order": 2,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "Otros",
                "uuid": "forum_category_disaster",
                "section": "forum_section_2_projects",
                "description": "¿no sabes donde escribir? aquí tienes un sitio donde poner lo que quieras.",
                "order": 4,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "sugerencias",
                "uuid": "forum_category_suggestions",
                "section": "forum_section_3_bitbloq",
                "description": "¿te gustaría alguna funcionalidad que no esté? ¡cuéntanosla!",
                "order": 2,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "laboratorio de ideas",
                "uuid": "forum_category_lab",
                "section": "forum_section_2_projects",
                "description": "aquí podrás contar tus ideas o coger inspiración para tus proyectos.",
                "order": 3,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "errores y fallos en la web",
                "uuid": "forum_category_errors",
                "section": "forum_section_3_bitbloq",
                "description": "¿encontraste algún error? ¿no funciona algo? aquí puedes darnos un toque.",
                "order": 3,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "noticias",
                "uuid": "forum_category_news",
                "section": "forum_section_1_main",
                "description": "últimas noticias y actualizaciones de bitbloq",
                "order": 1,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "bienvenida",
                "uuid": "forum_category_welcome",
                "section": "forum_section_1_main",
                "description": "bienvenidos a la comunidad a todos los nuevos makers.",
                "order": 2,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "¡ayuda!",
                "uuid": "forum_category_help",
                "section": "forum_section_2_projects",
                "description": "¿necesitas ayuda con algún proyecto? ¡pregunta aquí!",
                "order": 1,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "english",
                "uuid": "forum_category_en-gb",
                "section": "forum_section_4_language",
                "description": "",
                "order": 1,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "netherlands",
                "uuid": "forum_category_en-gb",
                "section": "forum_section_4_language",
                "description": "",
                "order": 2,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "pусский",
                "uuid": "forum_category_ru-ru",
                "section": "forum_section_4_language",
                "description": "",
                "order": 3,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "italiano",
                "uuid": "forum_category_it-it",
                "section": "forum_section_4_language",
                "description": "",
                "order": 4,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "euskara",
                "uuid": "forum_category_eu-es",
                "section": "forum_section_4_language",
                "description": "",
                "order": 5,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "català",
                "uuid": "forum_category_ca-es",
                "section": "forum_section_4_language",
                "description": "",
                "order": 6,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "français",
                "uuid": "forum_category_fr-fr",
                "section": "forum_section_4_language",
                "description": "",
                "order": 7,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "deutsch",
                "uuid": "forum_category_de-de",
                "section": "forum_section_4_language",
                "description": "",
                "order": 8,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "português",
                "uuid": "forum_category_pt-pt",
                "section": "forum_section_4_language",
                "description": "",
                "order": 9,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "galego",
                "uuid": "forum_category_gl",
                "section": "forum_section_4_language",
                "description": "",
                "order": 1,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "简体中文",
                "uuid": "forum_category_zh-cn",
                "section": "forum_section_4_language",
                "description": "",
                "order": 1,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            }, {
                "name": "preguntas",
                "uuid": "forum_category_questions",
                "section": "forum_section_3_bitbloq",
                "description": "aquí puedes aclarar todas tus dudas.",
                "order": 1,
                "numberOfAnswers": 0,
                "numberOfThreads": 0
            })
            .then(function() {
                console.log('finished populating forum categories');
            });
    });

// return User.find({}).removeAsync()
//   .then(function() {
//     return User.createAsync({
//         provider: 'local',
//         name: 'Test User',
//         email: 'test@example.com',
//         password: 'test'
//       }, {
//         provider: 'local',
//         role: 'admin',
//         name: 'Admin',
//         email: 'admin@example.com',
//         password: 'admin'
//       })
//       .then(function() {
//         console.log('finished populating users');
//       });
//   });

// return Project.find({}).removeAsync()
//   .then(function() {
//     return Project.createAsync({
//         "name" : "proyecto1",
//         "description" : "mi descripcion",
//         "code" : "mi code"
//       },
//       {
//         "name" : "proyecto2",
//         "description" : "otra mas",
//         "code" : "codecodecodecode"
//       })
//       .then(function() {
//         console.log('finished populating projects');
//       });
//   });