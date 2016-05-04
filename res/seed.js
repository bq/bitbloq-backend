/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
/*jshint -W109 */

'use strict';
var User = require('../api/user/user.model');
var Project = require('../api/project/project.model');
var Bloq = require('../api/bloq/bloq.model');
var Category = require('../api/forum/models/category.model');
var Property = require('../api/property/property.model');
var Token = require('../api/recovery/token.model');

User.find({}).removeAsync()
    .then(function() {
        return User.createAsync({
                provider: 'local',
                name: 'Test User',
                email: 'test@example.com',
                password: 'test'
            }, {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'admin@example.com',
                password: 'admin'
            })
            .then(function() {
                console.log('finished populating users');
            });
    });

Token.find({}).removeAsync()
    .then(function() {
        return Token.createAsync({
                "userId": "123456",
                "token": "987654"
            })
            .then(function() {
                console.log('finished populating tokens');
            });
    });

Project.find({}).removeAsync()
    .then(function() {
        return Project.createAsync({
                "name": "proyecto1",
                "description": "mi descripcion",
                "code": "mi code",
                "_acl": {
                    'user:57164392527b27df52dbe734': {
                        permission: 'ADMIN'
                    }
                }
            }, {
                "name": "proyecto2",
                "description": "otra mas",
                "code": "codecodecodecode",
                "_acl": {
                    'user:57164392527b27df52dbe734': {
                        permission: 'READ'
                    }
                }
            })
            .then(function() {
                console.log('finished populating projects');
            });
    });

Bloq.find({}).removeAsync()
    .then(function() {
        return Bloq.createAsync({
                "type": "output",
                "name": "arrayClassVariable",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-array-class-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-array-class-variable-variable"
                    }, {
                        "id": "VAR",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "["
                    }, {
                        "id": "POSITION",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "]"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-function-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "objects"
                    }]
                ],
                "code": "{CLASS}.{VAR}[{POSITION}]",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "VAR",
                    "pointer": "true",
                    "options": "softwareVars"
                }
            }, {
                "type": "statement-input",
                "name": "classChildren",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-class-children",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-class"
                    }, {
                        "id": "NAME",
                        "alias": "varInput",
                        "placeholder": "bloq-name-default"
                    }, {
                        "alias": "text",
                        "value": "bloq-class-inheritance-type"
                    }, {
                        "id": "TYPE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-class-inheritance-public",
                            "value": "public"
                        }, {
                            "label": "bloq-class-inheritance-protected",
                            "value": "protected"
                        }, {
                            "label": "bloq-class-inheritance-private",
                            "value": "private"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-class-from"
                    }, {
                        "id": "PARENT",
                        "alias": "dynamicDropdown",
                        "options": "classes"
                    }]
                ],
                "createDynamicContent": "classes",
                "code": "class {NAME} : public {PARENT}{{STATEMENTS}};",
                "hCode": "class {NAME}: public {PARENT}{{STATEMENTS}};",
                "cppCode": "",
                "returnType": {
                    "type": "simple",
                    "value": "class"
                }
            }, {
                "type": "statement-input",
                "name": "constructorClassArguments",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6f542e91-ee59-4c4a-9497-4366e876c8c8"
                }],
                "bloqClass": "bloq-constructor-arguments",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-constructor-arguments"
                    }, {
                        "bloqInputId": "ARGS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6f542e91-ee59-4c4a-9497-4366e876c8c8"
                    }]
                ],
                "code": "{CLASS-OUTSIDE} ({ARGS}){{STATEMENTS}};",
                "hCode": "{CLASS-OUTSIDE} ({ARGS});",
                "cppCode": "{CLASS-OUTSIDE} :: {CLASS-OUTSIDE} ({ARGS}){{STATEMENTS}};"
            }, {
                "type": "statement",
                "name": "invokeArgumentsClass",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "8a8c23ed-3e5c-4546-8460-eaf937049cba"
                }],
                "bloqClass": "bloq-invoke-arguments-class",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-arguments-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "classes"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-arguments-class-name"
                    }, {
                        "id": "NAME",
                        "alias": "varInput",
                        "placeholder": "bloq-name-default"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-arguments-args"
                    }, {
                        "bloqInputId": "ARGS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "8a8c23ed-3e5c-4546-8460-eaf937049cba"
                    }]
                ],
                "createDynamicContent": "objects",
                "code": "{CLASS} {NAME}({ARGS});",
                "returnType": {
                    "type": "simple",
                    "value": "var"
                }
            }, {
                "type": "statement",
                "name": "invokeClassFunctionWithArguments",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6f5aae66-1440-4b0b-87f8-c854f992b4f5"
                }],
                "bloqClass": "bloq-invoke-class-function-args",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-class-function-exec"
                    }, {
                        "id": "FUNCTION",
                        "alias": "dynamicDropdown",
                        "options": "voidFunctions"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-function-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "objects"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-function-args"
                    }, {
                        "bloqInputId": "ARGS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6f5aae66-1440-4b0b-87f8-c854f992b4f5"
                    }]
                ],
                "code": "{CLASS}.{FUNCTION}({ARGS});",
                "dynamicDropdown": {
                    "idDropdown": "FUNCTION",
                    "options": "voidFunctions"
                }
            }, {
                "type": "output",
                "name": "invokeClassReturnFunctionWithArguments",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "9dce54ef-a0cb-442b-b6e6-e7cd7bb11061"
                }],
                "bloqClass": "bloq-invoke-class-return-function",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-class-return-function-args-exec"
                    }, {
                        "id": "FUNCTION",
                        "alias": "dynamicDropdown",
                        "options": "returnFunctions"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-return-function-args-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "objects"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-return-function-args-args"
                    }, {
                        "bloqInputId": "ARGS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "9dce54ef-a0cb-442b-b6e6-e7cd7bb11061"
                    }]
                ],
                "code": "{CLASS}.{FUNCTION}({ARGS});",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "FUNCTION",
                    "options": "returnFunctions"
                }
            }, {
                "type": "statement-input",
                "name": "private",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-private",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-private"
                    }]
                ],
                "code": "private : {STATEMENTS}",
                "hCode": "private : {STATEMENTS}",
                "cppCode": ""
            }, {
                "type": "statement-input",
                "name": "protected",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-protected",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-protected"
                    }]
                ],
                "code": "protected : {STATEMENTS}",
                "hCode": "protected : {STATEMENTS}",
                "cppCode": ""
            }, {
                "type": "statement-input",
                "name": "public",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-public",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-public"
                    }]
                ],
                "code": "public : {STATEMENTS}",
                "hCode": "public : {STATEMENTS}",
                "cppCode": ""
            }, {
                "type": "statement",
                "name": "setClassArrayVariable",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": {
                        "type": "fromDynamicDropdown",
                        "idDropdown": "NAME",
                        "pointer": "true",
                        "options": "softwareVars"
                    },
                    "name": "d86d0fd1-57af-4210-8f68-7d28e1e9169a"
                }],
                "bloqClass": "bloq-set-class-variableArray",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-set-class-variableArray-variable"
                    }, {
                        "id": "NAME",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "["
                    }, {
                        "id": "ITERATOR",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "]"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-function-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "objects"
                    }, {
                        "alias": "text",
                        "value": "="
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": {
                            "type": "fromDynamicDropdown",
                            "idDropdown": "NAME",
                            "pointer": "true",
                            "options": "softwareVars"
                        },
                        "name": "d86d0fd1-57af-4210-8f68-7d28e1e9169a"
                    }]
                ],
                "code": "{CLASS}.{NAME}[{ITERATOR}] = {VALUE};"
            }, {
                "type": "statement-input",
                "name": "class",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-class",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-class"
                    }, {
                        "id": "NAME",
                        "alias": "varInput",
                        "placeholder": "bloq-name-default"
                    }]
                ],
                "createDynamicContent": "classes",
                "code": "class {NAME}{{STATEMENTS}};",
                "hCode": "class {NAME}{{STATEMENTS}};",
                "cppCode": "",
                "returnType": {
                    "type": "simple",
                    "value": "class"
                }
            }, {
                "type": "statement-input",
                "name": "constructorClass",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-constructor",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-constructor"
                    }]
                ],
                "code": "{CLASS-OUTSIDE}(){{STATEMENTS}};",
                "hCode": "{CLASS-OUTSIDE} ();",
                "cppCode": "{CLASS-OUTSIDE} :: {CLASS-OUTSIDE} (){{STATEMENTS}};"
            }, {
                "type": "statement",
                "name": "includeLib",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-include-lib",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-include-lib-exec"
                    }, {
                        "id": "LIB",
                        "alias": "dynamicDropdown",
                        "options": "libraries"
                    }]
                ],
                "code": "#include \"{LIB}\";"
            }, {
                "type": "statement",
                "name": "invokeClass",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-invoke-class",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "classes"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-name"
                    }, {
                        "id": "NAME",
                        "alias": "varInput",
                        "value": ""
                    }]
                ],
                "createDynamicContent": "objects",
                "code": "{CLASS} {NAME};",
                "returnType": {
                    "type": "simple",
                    "value": "var"
                }
            }, {
                "type": "statement",
                "name": "invokeClassFunction",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-invoke-class-function",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-class-function-exec"
                    }, {
                        "id": "FUNCTION",
                        "alias": "dynamicDropdown",
                        "options": "voidFunctions"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-function-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "objects"
                    }]
                ],
                "code": "{CLASS}.{FUNCTION}();",
                "dynamicDropdown": {
                    "idDropdown": "FUNCTION",
                    "options": "voidFunctions"
                }
            }, {
                "type": "output",
                "name": "invokeClassReturnFunction",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-invoke-class-return-function",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-class-return-function-exec"
                    }, {
                        "id": "FUNCTION",
                        "alias": "dynamicDropdown",
                        "options": "returnFunctions"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-function-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "objects"
                    }]
                ],
                "code": "{CLASS}.{FUNCTION}()",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "FUNCTION",
                    "options": "returnFunctions"
                }
            }, {
                "type": "output",
                "name": "selectClassVariable",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-select-class-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-select-class-variable-variable"
                    }, {
                        "id": "VAR",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-function-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "objects"
                    }]
                ],
                "code": "{CLASS}.{VAR}",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "VAR",
                    "options": "softwareVars"
                }
            }, {
                "type": "statement",
                "name": "setClassVariable",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": {
                        "type": "fromDynamicDropdown",
                        "idDropdown": "NAME",
                        "options": "softwareVars"
                    },
                    "name": "24559715-ad65-41cd-9b55-63d701752835"
                }],
                "bloqClass": "bloq-set-class-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-set-class-variable-variable"
                    }, {
                        "id": "NAME",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-class-function-class"
                    }, {
                        "id": "CLASS",
                        "alias": "dynamicDropdown",
                        "options": "objects"
                    }, {
                        "alias": "text",
                        "value": "="
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": {
                            "type": "fromDynamicDropdown",
                            "idDropdown": "NAME",
                            "options": "softwareVars"
                        },
                        "name": "24559715-ad65-41cd-9b55-63d701752835"
                    }]
                ],
                "code": "{CLASS}.{NAME} = {VALUE};"
            }, {
                "type": "statement",
                "name": "code",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-code",
                "content": [
                    [{
                        "id": "CODE",
                        "alias": "multilineCodeInput",
                        "value": "",
                        "placeholder": "bloq-code-writeYourCode"
                    }]
                ],
                "code": "{CODE}\n"
            }, {
                "type": "statement",
                "name": "comment",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-comment",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-comment-comment"
                    }, {
                        "id": "COMMENT",
                        "alias": "multilineCommentInput",
                        "placeholder": "bloq-comment-default"
                    }]
                ],
                "code": "/*\n{COMMENT}\n*/"
            }, {
                "type": "statement",
                "name": "enableInterrupt",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-enable-interrupt",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-enable-interrupt"
                    }, {
                        "id": "FUNC",
                        "alias": "dynamicDropdown",
                        "options": "voidFunctions"
                    }, {
                        "alias": "text",
                        "value": "bloq-enable-interrupt-pin"
                    }, {
                        "id": "PIN",
                        "alias": "dynamicDropdown",
                        "options": "varComponents"
                    }, {
                        "id": "STATE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-enable-interrupt-rising",
                            "value": "RISING"
                        }, {
                            "label": "bloq-enable-interrupt-falling",
                            "value": "FALLING"
                        }, {
                            "label": "bloq-enable-interrupt-change",
                            "value": "CHANGE"
                        }]
                    }]
                ],
                "code": "enableInterrupt({PIN}, {FUNC}, {STATE});"
            }, {
                "type": "output",
                "name": "convert",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "number",
                    "name": "7c9a9843-eb66-4124-8544-669394195128"
                }],
                "bloqClass": "bloq-convert",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-convert-convert"
                    }, {
                        "bloqInputId": "NUMBER",
                        "alias": "bloqInput",
                        "acceptType": "number",
                        "name": "7c9a9843-eb66-4124-8544-669394195128"
                    }, {
                        "alias": "text",
                        "value": "bloq-convert-to"
                    }, {
                        "id": "TYPE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-convert-dec",
                            "value": "DEC"
                        }, {
                            "label": "bloq-convert-hex",
                            "value": "HEX"
                        }, {
                            "label": "bloq-convert-oct",
                            "value": "OCT"
                        }, {
                            "label": "bloq-convert-bin",
                            "value": "BIN"
                        }]
                    }]
                ],
                "code": "({NUMBER},{TYPE});",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement",
                "name": "serialSend",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "67398e4d-345c-4b4c-9e94-7d16325d8aa2"
                }],
                "bloqClass": "bloq-serial-send",
                "content": [
                    [{
                        "id": "SERIAL",
                        "alias": "dynamicDropdown",
                        "options": "serialElements"
                    }, {
                        "alias": "text",
                        "value": "bloq-serial-send-send"
                    }, {
                        "bloqInputId": "DATA",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "67398e4d-345c-4b4c-9e94-7d16325d8aa2"
                    }, {
                        "id": "FUNCTION",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-serial-send-println",
                            "value": "println"
                        }, {
                            "label": "bloq-serial-send-print",
                            "value": "print"
                        }]
                    }]
                ],
                "code": "{SERIAL}.{FUNCTION}({DATA});"
            }, {
                "type": "output",
                "name": "serialReceive",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-serial-receiver",
                "content": [
                    [{
                        "id": "SERIAL",
                        "alias": "dynamicDropdown",
                        "options": "serialElements"
                    }, {
                        "alias": "text",
                        "value": "bloq-serial-receiver-receive"
                    }]
                ],
                "code": "{SERIAL}.readString()",
                "returnType": {
                    "type": "simple",
                    "value": "String"
                }
            }, {
                "type": "statement",
                "name": "serialSend-v1",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "da3975be-c240-46be-aeb8-97db97683cea"
                }],
                "bloqClass": "bloq-serial-send",
                "content": [
                    [{
                        "id": "SERIAL",
                        "alias": "dynamicDropdown",
                        "options": "serialElements"
                    }, {
                        "alias": "text",
                        "value": "bloq-serial-send-send"
                    }, {
                        "bloqInputId": "DATA",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "da3975be-c240-46be-aeb8-97db97683cea"
                    }, {
                        "id": "LN",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-serial-send-println",
                            "value": "println"
                        }, {
                            "label": "bloq-serial-send-print",
                            "value": "print"
                        }]
                    }]
                ],
                "code": "{SERIAL}.{LN}({DATA});"
            }, {
                "type": "statement",
                "name": "rgbLed",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-rgbLed",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-rgbLed"
                    }, {
                        "id": "LED",
                        "alias": "dynamicDropdown",
                        "options": "rgbs"
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-red"
                    }, {
                        "id": "RED",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-green"
                    }, {
                        "id": "GREEN",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-blue"
                    }, {
                        "id": "BLUE",
                        "alias": "numberInput",
                        "value": 0
                    }]
                ],
                "code": "{LED}.setRGBcolor({RED},{GREEN},{BLUE});"
            }, {
                "type": "statement",
                "name": "rgbLedFade",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-rgbLed-fade",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-rgbLed-fade"
                    }, {
                        "id": "LED",
                        "alias": "dynamicDropdown",
                        "options": "rgbs"
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-fade-red"
                    }, {
                        "id": "RED",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-fade-green"
                    }, {
                        "id": "GREEN",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-fade-blue"
                    }, {
                        "id": "BLUE",
                        "alias": "numberInput",
                        "value": 0
                    }]
                ],
                "code": "{LED}.crossFade({RED},{GREEN},{BLUE});"
            }, {
                "type": "statement",
                "name": "rgbLedSimple",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-rgbLed-simple",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-rgbLed-simple"
                    }, {
                        "id": "LED",
                        "alias": "dynamicDropdown",
                        "options": "rgbs"
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-simple-color"
                    }, {
                        "id": "COLOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-rgbLed-simple-white",
                            "value": "255,255,255"
                        }, {
                            "label": "bloq-rgbLed-simple-yellow",
                            "value": "255,255,0"
                        }, {
                            "label": "bloq-rgbLed-simple-orange",
                            "value": "200,50,0"
                        }, {
                            "label": "bloq-rgbLed-simple-red",
                            "value": "255,0,0"
                        }, {
                            "label": "bloq-rgbLed-simple-green",
                            "value": "0,255,0"
                        }, {
                            "label": "bloq-rgbLed-simple-dark-green",
                            "value": "0,60,102"
                        }, {
                            "label": "bloq-rgbLed-simple-blue",
                            "value": "40,40,255"
                        }, {
                            "label": "bloq-rgbLed-simple-dark-blue",
                            "value": "0,0,255"
                        }, {
                            "label": "bloq-rgbLed-simple-pink",
                            "value": "255,0,255"
                        }]
                    }]
                ],
                "code": "{LED}.setRGBcolor({COLOR});"
            }, {
                "type": "statement",
                "name": "rgbLedAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "7039a5cf-2cc1-4aa9-922a-3596fa09081f"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "56d0079d-7034-49ce-a187-6fe0725a9c8b"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "8d79e88b-ba18-4b10-bd9a-00539ad2d567"
                }],
                "bloqClass": "bloq-rgbLed-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-rgbLed"
                    }, {
                        "id": "LED",
                        "alias": "dynamicDropdown",
                        "options": "rgbs"
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-red"
                    }, {
                        "bloqInputId": "RED",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "7039a5cf-2cc1-4aa9-922a-3596fa09081f"
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-green"
                    }, {
                        "bloqInputId": "GREEN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "56d0079d-7034-49ce-a187-6fe0725a9c8b"
                    }, {
                        "alias": "text",
                        "value": "bloq-rgbLed-blue"
                    }, {
                        "bloqInputId": "BLUE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "8d79e88b-ba18-4b10-bd9a-00539ad2d567"
                    }]
                ],
                "code": "{LED}.setRGBcolor({RED},{GREEN},{BLUE});"
            }, {
                "type": "output",
                "name": "analogReadAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "3c72af12-a979-4d21-82bd-356563799088"
                }],
                "bloqClass": "bloq-analog-read-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-analog-read-advanced-readpin"
                    }, {
                        "bloqInputId": "PIN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "3c72af12-a979-4d21-82bd-356563799088"
                    }]
                ],
                "code": "'{PIN}'.indexOf('A') !== -1 ? 'analogRead({PIN})'.replace(/\"/g, '') : 'analogRead({PIN})'",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement",
                "name": "analogWrite",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "31fe847b-feb9-4999-81bc-e863a8662110"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "8f11a7a7-a23d-4501-b565-2648caf1f961"
                }],
                "bloqClass": "bloq-pin-writte-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-pin-analog-write"
                    }, {
                        "bloqInputId": "PIN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "31fe847b-feb9-4999-81bc-e863a8662110"
                    }, {
                        "alias": "text",
                        "value": "bloq-pin-analog-write-data"
                    }, {
                        "bloqInputId": "DATA",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "8f11a7a7-a23d-4501-b565-2648caf1f961"
                    }]
                ],
                "code": "'{PIN}'.indexOf('A') !== -1 ? 'analogWrite({PIN},{DATA});'.replace(/\"/g, '') : 'analogWrite({PIN},{DATA});'"
            }, {
                "type": "statement",
                "name": "buzzerAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "825424ed-f63b-4719-be11-d36dc86ee79e"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "af53d0e1-3509-46a3-8e48-e51076d80656"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "e0f567f7-2ba7-48ee-8a9a-fd17ddc967ed"
                }],
                "bloqClass": "bloq-buzzer-advance",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-buzzer-advance-sound"
                    }, {
                        "bloqInputId": "BUZZER",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "825424ed-f63b-4719-be11-d36dc86ee79e"
                    }, {
                        "alias": "text",
                        "value": "bloq-buzzer-advance-note"
                    }, {
                        "bloqInputId": "NOTE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "af53d0e1-3509-46a3-8e48-e51076d80656"
                    }, {
                        "alias": "text",
                        "value": "bloq-buzzer-advance-for"
                    }, {
                        "bloqInputId": "SECONDS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "e0f567f7-2ba7-48ee-8a9a-fd17ddc967ed"
                    }, {
                        "alias": "text",
                        "value": "bloq-buzzer-advance-ms"
                    }]
                ],
                "code": "tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});"
            }, {
                "type": "statement",
                "name": "continuousServoStartAdvanced-v1",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "2c01fca1-ef75-4017-ab89-a76429792b1d"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "4d7f1ec7-0072-4859-83f3-9f38b70f554c"
                }],
                "bloqClass": "bloq-continuous-servo-start-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-continuous-servo-start-advanced-turn"
                    }, {
                        "bloqInputId": "SERVO",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "2c01fca1-ef75-4017-ab89-a76429792b1d"
                    }, {
                        "alias": "text",
                        "value": "bloq-continuous-servo-start-advanced-direction"
                    }, {
                        "bloqInputId": "DIRECTION",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "4d7f1ec7-0072-4859-83f3-9f38b70f554c"
                    }]
                ],
                "code": "{SERVO}.write({DIRECTION});"
            }, {
                "type": "statement",
                "name": "continuousServoStopAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "d3fbbd99-ab71-41bc-a950-916ce2ded4f5"
                }],
                "bloqClass": "bloq-continuous-servo-stop-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-continuous-servo-stop-advanced-stop"
                    }, {
                        "bloqInputId": "SERVO",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "d3fbbd99-ab71-41bc-a950-916ce2ded4f5"
                    }]
                ],
                "code": "{SERVO}.write(90);"
            }, {
                "type": "output",
                "name": "digitalReadAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "29653976-d699-450c-8bd6-874cd5b9c2df"
                }],
                "bloqClass": "bloq-digital-read-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-digital-read-advanced-readpin"
                    }, {
                        "bloqInputId": "PIN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "29653976-d699-450c-8bd6-874cd5b9c2df"
                    }]
                ],
                "code": "digitalRead({PIN})",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement",
                "name": "digitalWrite",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "889e3fb3-4bfd-4730-8984-4a35505c5528"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "bd7cbf45-98c0-4560-bc28-fcf2bbd67704"
                }],
                "bloqClass": "bloq-pin-writte-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-pin-digital-write"
                    }, {
                        "bloqInputId": "PIN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "889e3fb3-4bfd-4730-8984-4a35505c5528"
                    }, {
                        "alias": "text",
                        "value": "bloq-pin-digital-write-data"
                    }, {
                        "bloqInputId": "DATA",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "bd7cbf45-98c0-4560-bc28-fcf2bbd67704"
                    }]
                ],
                "code": "digitalWrite({PIN},{DATA});"
            }, {
                "type": "statement",
                "name": "lcdTurnOnOffAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "b6d444bc-448c-45bd-a1f6-bcee56196560"
                }],
                "bloqClass": "bloq-lcd-turn-on-off-advanced",
                "content": [
                    [{
                        "id": "STATE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-lcd-turn-on-off-advanced-turnon",
                            "value": "HIGH"
                        }, {
                            "label": "bloq-lcd-turn-on-off-advanced-turnoff",
                            "value": "LOW"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-turn-on-off-advanced-lcdLigth"
                    }, {
                        "bloqInputId": "LCD",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "b6d444bc-448c-45bd-a1f6-bcee56196560"
                    }]
                ],
                "code": "{LCD}.setBacklight({STATE});"
            }, {
                "type": "statement",
                "name": "lcdWriteAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "a7230163-d85b-4149-87a3-7388d5c4d07f"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6323e18d-5844-42f1-adda-5eeb364b2193"
                }],
                "bloqClass": "bloq-lcd-writte-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-lcd-writte-advanced-write"
                    }, {
                        "bloqInputId": "TEXT",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "a7230163-d85b-4149-87a3-7388d5c4d07f"
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-writte-advanced-inLCD"
                    }, {
                        "bloqInputId": "LCD",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6323e18d-5844-42f1-adda-5eeb364b2193"
                    }]
                ],
                "code": "{LCD}.print({TEXT});"
            }, {
                "type": "statement",
                "name": "lcdWritePositionAdvanced-v1",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "b80a52e9-67cf-4a44-af3e-ad93f91146cc"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "e02b9f19-524a-4b64-aa88-8e495429546d"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "20606a0c-30eb-4c6a-a597-fdc1993a5600"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "0a93de91-d255-46e1-aad6-22f62cb67278"
                }],
                "bloqClass": "bloq-lcd-writte",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-lcd-writte-write"
                    }, {
                        "bloqInputId": "TEXT",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "b80a52e9-67cf-4a44-af3e-ad93f91146cc"
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-writte-inLCD"
                    }, {
                        "bloqInputId": "LCD",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "e02b9f19-524a-4b64-aa88-8e495429546d"
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-writte-advanced-inPosition"
                    }, {
                        "bloqInputId": "COLUMN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "20606a0c-30eb-4c6a-a597-fdc1993a5600"
                    }, {
                        "bloqInputId": "ROW",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "0a93de91-d255-46e1-aad6-22f62cb67278"
                    }]
                ],
                "code": "{LCD}.setCursor({COLUMN},{ROW});{LCD}.print({TEXT});"
            }, {
                "type": "statement",
                "name": "ledAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "c194051a-70ce-4d1c-b379-0fca5662b2b9"
                }],
                "bloqClass": "bloq-led-advanced",
                "content": [
                    [{
                        "id": "STATE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-led-advanced-turnon",
                            "value": "HIGH"
                        }, {
                            "label": "bloq-led-advanced-turnoff",
                            "value": "LOW"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-led-advanced-theLED"
                    }, {
                        "bloqInputId": "LED",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "c194051a-70ce-4d1c-b379-0fca5662b2b9"
                    }]
                ],
                "code": "digitalWrite({LED},{STATE});"
            }, {
                "type": "statement",
                "name": "oscillatorAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6205f715-ac3e-4713-8f24-514d8a66ae59"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "05064224-f84a-4587-b91c-c719bd2fb18a"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "536ac986-ef5f-4db2-87aa-f8dd0e9b8189"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "65ae3498-c3e8-4af5-8c46-2bec6c9c252c"
                }],
                "bloqClass": "bloq-oscillator-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-oscillator-advanced-oscillate"
                    }, {
                        "bloqInputId": "OSCILLATOR",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6205f715-ac3e-4713-8f24-514d8a66ae59"
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-advanced-around"
                    }, {
                        "bloqInputId": "PHASE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "05064224-f84a-4587-b91c-c719bd2fb18a"
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-advanced-amplitude"
                    }, {
                        "bloqInputId": "AMPLITUDE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "536ac986-ef5f-4db2-87aa-f8dd0e9b8189"
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-advanced-speed"
                    }, {
                        "bloqInputId": "SPEED",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "65ae3498-c3e8-4af5-8c46-2bec6c9c252c"
                    }]
                ],
                "code": "{OSCILLATOR}.SetO({PHASE});\n{OSCILLATOR}.SetA({AMPLITUDE});\n{OSCILLATOR}.SetT({SPEED});\n{OSCILLATOR}.refresh();"
            }, {
                "type": "statement",
                "name": "oscillatorStartAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6f8f4263-c49c-476f-aad0-8741b632f36a"
                }],
                "bloqClass": "bloq-oscillator-start-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-oscillator-start-advanced-oscillator"
                    }, {
                        "bloqInputId": "OSCILLATOR",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6f8f4263-c49c-476f-aad0-8741b632f36a"
                    }]
                ],
                "code": "{OSCILLATOR}.start()"
            }, {
                "type": "statement",
                "name": "oscillatorStopAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "f295a607-f1ee-4b8b-9964-5729eafce0f4"
                }],
                "bloqClass": "bloq-oscillator-stop-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-oscillator-stop-advanced-stop"
                    }, {
                        "bloqInputId": "OSCILLATOR",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "f295a607-f1ee-4b8b-9964-5729eafce0f4"
                    }]
                ],
                "code": "{OSCILLATOR}.stop()"
            }, {
                "type": "statement",
                "name": "servoNormalAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "703e1971-4449-4de1-8b5a-d806c5f0d72f"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "686c7fae-d206-452c-b4c4-7431f39ecc79"
                }],
                "bloqClass": "bloq-servo-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-servo-advanced-move"
                    }, {
                        "bloqInputId": "SERVO",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "703e1971-4449-4de1-8b5a-d806c5f0d72f"
                    }, {
                        "alias": "text",
                        "value": "bloq-servo-advanced-to"
                    }, {
                        "bloqInputId": "POSITION",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "686c7fae-d206-452c-b4c4-7431f39ecc79"
                    }, {
                        "alias": "text",
                        "value": "bloq-servo-advanced-degrees"
                    }]
                ],
                "code": "{SERVO}.write({POSITION});"
            }, {
                "type": "statement",
                "name": "servoAttach",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-servo-attach",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-servo-attach"
                    }, {
                        "id": "SERVO",
                        "alias": "dynamicDropdown",
                        "options": "servos"
                    }]
                ],
                "code": "{SERVO}.attach({SERVO.pin});"
            }, {
                "type": "statement",
                "name": "servoDetach",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-servo-detach",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-servo-detach"
                    }, {
                        "id": "SERVO",
                        "alias": "dynamicDropdown",
                        "options": "servos"
                    }]
                ],
                "code": "{SERVO}.detach();"
            }, {
                "type": "statement",
                "name": "buzzer",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-buzzer",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-buzzer-sound"
                    }, {
                        "id": "BUZZER",
                        "alias": "dynamicDropdown",
                        "options": "buzzers"
                    }, {
                        "alias": "text",
                        "value": "bloq-buzzer-note"
                    }, {
                        "id": "NOTE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-buzzer-do",
                            "value": "261"
                        }, {
                            "label": "bloq-buzzer-re",
                            "value": "293"
                        }, {
                            "label": "bloq-buzzer-mi",
                            "value": "329"
                        }, {
                            "label": "bloq-buzzer-fa",
                            "value": "349"
                        }, {
                            "label": "bloq-buzzer-sol",
                            "value": "392"
                        }, {
                            "label": "bloq-buzzer-la",
                            "value": "440"
                        }, {
                            "label": "bloq-buzzer-si",
                            "value": "494"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-buzzer-for"
                    }, {
                        "id": "SECONDS",
                        "alias": "numberInput",
                        "value": 2000
                    }, {
                        "alias": "text",
                        "value": "bloq-buzzer-ms"
                    }]
                ],
                "code": "tone({BUZZER},{NOTE},{SECONDS});\ndelay({SECONDS});"
            }, {
                "type": "statement",
                "name": "continuousServoStart",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-continuous-servo-start",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-continuous-servo-start-turn"
                    }, {
                        "id": "SERVO",
                        "alias": "dynamicDropdown",
                        "options": "continuousServos"
                    }, {
                        "alias": "text",
                        "value": "bloq-continuous-servo-start-direction"
                    }, {
                        "id": "DIRECTION",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-continuous-servo-start-clockwise",
                            "value": "180"
                        }, {
                            "label": "bloq-continuous-servo-start-counterclockwise",
                            "value": "0"
                        }]
                    }]
                ],
                "code": "{SERVO}.write({DIRECTION});"
            }, {
                "type": "statement",
                "name": "continuousServoStop",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-continuous-servo-stop",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-continuous-servo-stop-stop"
                    }, {
                        "id": "SERVO",
                        "alias": "dynamicDropdown",
                        "options": "continuousServos"
                    }]
                ],
                "code": "{SERVO}.write(90);"
            }, {
                "type": "statement",
                "name": "continuousServoStartAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-continuous-servo-start-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-continuous-servo-start-advanced-turn"
                    }, {
                        "continuousServoStartAdvancedInputId": "SERVO",
                        "alias": "continuousServoStartAdvancedInput",
                        "acceptType": "all"
                    }, {
                        "alias": "text",
                        "value": "bloq-continuous-servo-start-advanced-direction"
                    }, {
                        "id": "DIRECTION",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-continuous-servo-start-advanced-clockwise",
                            "value": "0"
                        }, {
                            "label": "bloq-continuous-servo-start-advanced-counterclockwise",
                            "value": "180"
                        }]
                    }]
                ],
                "code": "{SERVO}.write({DIRECTION});"
            }, {
                "type": "statement",
                "name": "lcdWritePositionAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "b02e3d9b-8747-4407-9b07-6d76bfcc392f"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "667dd3a0-5876-4f92-840d-3652e6bab5fa"
                }],
                "bloqClass": "bloq-lcd-writte deprecated",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-lcd-writte-write"
                    }, {
                        "bloqInputId": "TEXT",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "b02e3d9b-8747-4407-9b07-6d76bfcc392f"
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-writte-inLCD"
                    }, {
                        "bloqInputId": "LCD",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "667dd3a0-5876-4f92-840d-3652e6bab5fa"
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-writte-advanced-inPosition"
                    }, {
                        "id": "COLUMN",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "id": "ROW",
                        "alias": "numberInput",
                        "value": 0
                    }]
                ],
                "code": "{LCD}.setCursor({COLUMN},{ROW});{LCD}.print({TEXT});"
            }, {
                "type": "output",
                "name": "pinReadAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "3fec4fa9-a918-4375-bb68-c00ae81ceb50"
                }],
                "bloqClass": "bloq-pin-read-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-pin-read-advanced-readpin"
                    }, {
                        "bloqInputId": "PIN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "3fec4fa9-a918-4375-bb68-c00ae81ceb50"
                    }]
                ],
                "code": "'{PIN}'.indexOf('A') !== -1 ? 'analogRead({PIN})' : 'digitalRead({PIN})'",
                "returnType": {
                    "type": "simple",
                    "value": "bool"
                }
            }, {
                "type": "statement",
                "name": "pinWriteAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "2068541f-78d7-4226-a837-ee67708bd144"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "4ef0d912-236c-43e4-867b-11ba3184417a"
                }],
                "bloqClass": "bloq-pin-writte-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-pin-writte-advanced-writepin"
                    }, {
                        "bloqInputId": "PIN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "2068541f-78d7-4226-a837-ee67708bd144"
                    }, {
                        "alias": "text",
                        "value": "bloq-pin-writte-advanced-data"
                    }, {
                        "bloqInputId": "DATA",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "4ef0d912-236c-43e4-867b-11ba3184417a"
                    }]
                ],
                "code": "'{PIN}'.indexOf('A') === 0 ? 'analogWrite({PIN},{DATA});' : 'digitalWrite({PIN},{DATA});'"
            }, {
                "type": "output",
                "name": "readSensorAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "639f36ed-956b-4b55-9458-e4b51db954b2"
                }],
                "bloqClass": "bloq-read-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-read-advanced-read"
                    }, {
                        "bloqInputId": "PIN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "639f36ed-956b-4b55-9458-e4b51db954b2"
                    }]
                ],
                "code": "{SENSOR.type}",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "SENSOR",
                    "options": "sensors"
                }
            }, {
                "type": "output",
                "name": "hts221Humidity",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-hts221-humidity",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-hts221-humidity"
                    }, {
                        "id": "SENSOR",
                        "alias": "dynamicDropdown",
                        "options": "hts221"
                    }]
                ],
                "code": "{SENSOR}.getHumidity()",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "hts221Temperature",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-hts221-temperature",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-hts221-temperature"
                    }, {
                        "id": "SENSOR",
                        "alias": "dynamicDropdown",
                        "options": "hts221"
                    }]
                ],
                "code": "{SENSOR}.getTemperature()",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement",
                "name": "lcdClear",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-lcd-clear",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-lcd-clear"
                    }, {
                        "id": "LCD",
                        "alias": "dynamicDropdown",
                        "options": "lcds"
                    }]
                ],
                "code": "{LCD}.clear();"
            }, {
                "type": "statement",
                "name": "lcdTurnOnOff",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-lcd-turn-on-off",
                "content": [
                    [{
                        "id": "STATE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-lcd-turn-on-off-turnon",
                            "value": "HIGH"
                        }, {
                            "label": "bloq-lcd-turn-on-off-turnoff",
                            "value": "LOW"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-turn-on-off-lcdLigth"
                    }, {
                        "id": "LCD",
                        "alias": "dynamicDropdown",
                        "options": "lcds"
                    }]
                ],
                "code": "{LCD}.setBacklight({STATE});"
            }, {
                "type": "statement",
                "name": "lcdWrite",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-lcd-writte",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-lcd-writte-write"
                    }, {
                        "id": "TEXT",
                        "alias": "stringInput",
                        "defaultValue": "bloq-lcd-default"
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-writte-inLCD"
                    }, {
                        "id": "LCD",
                        "alias": "dynamicDropdown",
                        "options": "lcds"
                    }]
                ],
                "code": "{LCD}.print(\"{TEXT}\");"
            }, {
                "type": "statement",
                "name": "lcdWritePosition",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-lcd-writte",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-lcd-writte-write"
                    }, {
                        "id": "TEXT",
                        "alias": "stringInput",
                        "defaultValue": "bloq-lcd-default"
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-writte-inLCD"
                    }, {
                        "id": "LCD",
                        "alias": "dynamicDropdown",
                        "options": "lcds"
                    }, {
                        "alias": "text",
                        "value": "bloq-lcd-writte-advanced-inPosition"
                    }, {
                        "id": "COLUMN",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "id": "ROW",
                        "alias": "numberInput",
                        "value": 0
                    }]
                ],
                "code": "{LCD}.setCursor({COLUMN},{ROW});{LCD}.print(\"{TEXT}\");"
            }, {
                "type": "statement",
                "name": "led",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-led",
                "content": [
                    [{
                        "id": "STATE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-led-turnon",
                            "value": "HIGH"
                        }, {
                            "label": "bloq-led-turnoff",
                            "value": "LOW"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-led-theLED"
                    }, {
                        "id": "LED",
                        "alias": "dynamicDropdown",
                        "options": "leds"
                    }]
                ],
                "code": "digitalWrite({LED},{STATE});"
            }, {
                "type": "statement",
                "name": "oscillator",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-oscillator",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-oscillator-oscillate"
                    }, {
                        "id": "OSCILLATOR",
                        "alias": "dynamicDropdown",
                        "options": "oscillators"
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-around"
                    }, {
                        "id": "PHASE",
                        "alias": "numberInput",
                        "value": 90
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-amplitude"
                    }, {
                        "id": "AMPLITUDE",
                        "alias": "numberInput",
                        "value": 90
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "numberInput",
                        "value": 2000
                    }]
                ],
                "code": "{OSCILLATOR}.SetO({PHASE});{OSCILLATOR}.SetA({AMPLITUDE});{OSCILLATOR}.SetT({SPEED});{OSCILLATOR}.refresh();"
            }, {
                "type": "statement",
                "name": "oscillatorStart",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-oscillator-start",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-oscillator-start-oscillator"
                    }, {
                        "id": "OSCILLATOR",
                        "alias": "dynamicDropdown",
                        "options": "oscillators"
                    }]
                ],
                "code": "{OSCILLATOR}.Play();"
            }, {
                "type": "statement",
                "name": "oscillatorStop",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-oscillator-stop",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-oscillator-stop-stop"
                    }, {
                        "id": "OSCILLATOR",
                        "alias": "dynamicDropdown",
                        "options": "oscillators"
                    }]
                ],
                "code": "{OSCILLATOR}.Stop();"
            }, {
                "type": "statement",
                "name": "oscillatorTimes",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-oscillator",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-oscillator-oscillate"
                    }, {
                        "id": "OSCILLATOR",
                        "alias": "dynamicDropdown",
                        "options": "oscillators"
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-around"
                    }, {
                        "id": "PHASE",
                        "alias": "numberInput",
                        "value": 90
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-amplitude"
                    }, {
                        "id": "AMPLITUDE",
                        "alias": "numberInput",
                        "value": 90
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "numberInput",
                        "value": 2000
                    }, {
                        "id": "TIMES",
                        "alias": "numberInput",
                        "value": 2
                    }, {
                        "alias": "text",
                        "value": "bloq-oscillator-times"
                    }]
                ],
                "code": "oscillate({OSCILLATOR}, {AMPLITUDE}, {PHASE}, {SPEED}, {TIMES});"
            }, {
                "type": "output",
                "name": "readSensor",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-read-sensor",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-read-read"
                    }, {
                        "id": "SENSOR",
                        "alias": "dynamicDropdown",
                        "options": "sensors"
                    }]
                ],
                "code": "{SENSOR.type}",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "SENSOR",
                    "options": "sensors"
                }
            }, {
                "type": "output",
                "name": "clockRTC",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-rtc",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-rtc"
                    }, {
                        "id": "RTC_FUNC",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-rtc-date",
                            "value": "getDate"
                        }, {
                            "label": "bloq-rtc-time",
                            "value": "getTime"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-rtc-using"
                    }, {
                        "id": "RTC",
                        "alias": "dynamicDropdown",
                        "options": "clocks"
                    }]
                ],
                "code": "{RTC}.{RTC_FUNC}()",
                "returnType": {
                    "type": "simple",
                    "value": "String"
                }
            }, {
                "type": "output",
                "name": "clockRTCAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-rtc-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-rtc-advanced"
                    }, {
                        "id": "FUNCTION",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-rtc-hour",
                            "value": "getHour"
                        }, {
                            "label": "bloq-rtc-minute",
                            "value": "getMinute"
                        }, {
                            "label": "bloq-rtc-second",
                            "value": "getSecond"
                        }, {
                            "label": "bloq-rtc-day",
                            "value": "getDay"
                        }, {
                            "label": "bloq-rtc-month",
                            "value": "getMonth"
                        }, {
                            "label": "bloq-rtc-year",
                            "value": "getYear"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-rtc-using-advanced"
                    }, {
                        "id": "RTC",
                        "alias": "dynamicDropdown",
                        "options": "clocks"
                    }]
                ],
                "code": "{RTC}.{FUNCTION}()",
                "returnType": {
                    "type": "simple",
                    "value": "int"
                }
            }, {
                "type": "statement",
                "name": "clockRTCInit",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-rtc-init",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-rtc-init"
                    }, {
                        "id": "RTC",
                        "alias": "dynamicDropdown",
                        "options": "clocks"
                    }]
                ],
                "code": "{RTC}.adjust(DateTime(__DATE__, __TIME__));"
            }, {
                "type": "statement",
                "name": "servoNormal",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-servo",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-servo-move"
                    }, {
                        "id": "SERVO",
                        "alias": "dynamicDropdown",
                        "options": "servos"
                    }, {
                        "alias": "text",
                        "value": "bloq-servo-to"
                    }, {
                        "id": "POSITION",
                        "alias": "numberInput",
                        "value": 90
                    }, {
                        "alias": "text",
                        "value": "bloq-servo-degrees"
                    }]
                ],
                "code": "{SERVO}.write({POSITION});"
            }, {
                "type": "statement-input",
                "name": "elseifAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "136cc959-7f91-42b8-b6b7-dc37d9339ae0"
                }],
                "bloqClass": "bloq-else-if",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-else-if-if"
                    }, {
                        "bloqInputId": "VAR",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "136cc959-7f91-42b8-b6b7-dc37d9339ae0"
                    }, {
                        "alias": "text",
                        "value": "bloq-else-if-else"
                    }]
                ],
                "code": "else if ({VAR}){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "forAdvanced-v1",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "cb74e0d1-313f-4822-a060-26c4cff8e59b"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "c8c09634-a0e9-4d4b-8242-55ef9088c11c"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "57e282c0-ac22-4271-bdf1-cb5155c91cfc"
                }],
                "bloqClass": "bloq-for",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-for-count"
                    }, {
                        "bloqInputId": "VAR",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "cb74e0d1-313f-4822-a060-26c4cff8e59b"
                    }, {
                        "alias": "text",
                        "value": "bloq-for-from"
                    }, {
                        "bloqInputId": "INIT",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "c8c09634-a0e9-4d4b-8242-55ef9088c11c"
                    }, {
                        "alias": "text",
                        "value": "bloq-for-to"
                    }, {
                        "bloqInputId": "FINAL",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "57e282c0-ac22-4271-bdf1-cb5155c91cfc"
                    }, {
                        "id": "MODE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-for-add",
                            "value": "+"
                        }, {
                            "label": "bloq-for-subtract",
                            "value": "-"
                        }]
                    }, {
                        "id": "ADD",
                        "alias": "numberInput",
                        "value": 1
                    }, {
                        "alias": "text",
                        "value": "bloq-for-exec"
                    }]
                ],
                "code": "'for({VAR}={INIT};{VAR}' + ('{MODE}' === '+'?'<=':'>=' ) + '{FINAL};{VAR}{MODE}={ADD}){{STATEMENTS}}'"
            }, {
                "type": "statement-input",
                "name": "ifAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6dcdc153-ccce-45de-b3ef-36d42696938a"
                }],
                "bloqClass": "bloq-if",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-if-if"
                    }, {
                        "bloqInputId": "CONDITION",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6dcdc153-ccce-45de-b3ef-36d42696938a"
                    }, {
                        "alias": "text",
                        "value": "bloq-if-exec"
                    }]
                ],
                "code": "if({CONDITION}){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "switchAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "28d10732-75b7-4be4-a901-3746059306cd"
                }],
                "bloqClass": "bloq-switch",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-switch-check"
                    }, {
                        "bloqInputId": "VAR",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "28d10732-75b7-4be4-a901-3746059306cd"
                    }]
                ],
                "code": "switch (int({VAR})) {{STATEMENTS}}"
            }, {
                "type": "statement",
                "name": "waitAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "5b38f04f-d135-4744-8382-da22c93f78dd"
                }],
                "bloqClass": "bloq-wait",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-wait-wait"
                    }, {
                        "bloqInputId": "TIME",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "5b38f04f-d135-4744-8382-da22c93f78dd"
                    }]
                ],
                "code": "delay({TIME});"
            }, {
                "type": "statement-input",
                "name": "whileAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "ce0dadb4-6297-414b-8b69-9ab150856efa"
                }],
                "bloqClass": "bloq-while",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-while-while"
                    }, {
                        "bloqInputId": "CONDITION",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "ce0dadb4-6297-414b-8b69-9ab150856efa"
                    }, {
                        "alias": "text",
                        "value": "bloq-while-exec"
                    }]
                ],
                "code": "while ({CONDITION}){{STATEMENTS}}"
            }, {
                "type": "statement",
                "name": "break",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-break",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-break-stopLoop"
                    }]
                ],
                "code": "break;"
            }, {
                "type": "statement-input",
                "name": "case",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-case",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-case-ifSameTo"
                    }, {
                        "id": "VAR",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "bloq-case-exec"
                    }]
                ],
                "code": "case {VAR}:{STATEMENTS}break;"
            }, {
                "type": "statement-input",
                "name": "caseDefault",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-case-default",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-case-default-inOtherCase"
                    }]
                ],
                "code": "default:{STATEMENTS}break;"
            }, {
                "type": "statement",
                "name": "continue",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-continue",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-continue-continue"
                    }]
                ],
                "code": "continue;"
            }, {
                "type": "statement-input",
                "name": "for",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-for deprecated",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-for-count"
                    }, {
                        "id": "VAR",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "bloq-for-from"
                    }, {
                        "id": "INIT",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "bloq-for-to"
                    }, {
                        "id": "FINAL",
                        "alias": "numberInput",
                        "value": 10
                    }, {
                        "id": "MODE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-for-add",
                            "value": "++"
                        }, {
                            "label": "bloq-for-subtract",
                            "value": "--"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-for-exec"
                    }]
                ],
                "code": "for({VAR}={INIT};{VAR}<{FINAL};{VAR}{MODE}){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "forAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "2ed7e0e6-5e9a-4ce8-9922-095bb99790fd"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "2b281cc5-b87e-46ba-b309-81306433eb21"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "d15cfb37-6a2f-4513-aca1-dc4f15f6a33c"
                }],
                "bloqClass": "bloq-for deprecated",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-for-count"
                    }, {
                        "bloqInputId": "VAR",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "2ed7e0e6-5e9a-4ce8-9922-095bb99790fd"
                    }, {
                        "alias": "text",
                        "value": "bloq-for-from"
                    }, {
                        "bloqInputId": "INIT",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "2b281cc5-b87e-46ba-b309-81306433eb21"
                    }, {
                        "alias": "text",
                        "value": "bloq-for-to"
                    }, {
                        "bloqInputId": "FINAL",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "d15cfb37-6a2f-4513-aca1-dc4f15f6a33c"
                    }, {
                        "id": "MODE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-for-add",
                            "value": "++"
                        }, {
                            "label": "bloq-for-subtract",
                            "value": "--"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-for-exec"
                    }]
                ],
                "code": "for({VAR}={INIT};{VAR}<{FINAL};{VAR}{MODE}){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "else",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-else",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-else-else"
                    }]
                ],
                "code": "else {{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "elseif",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "938609a0-a28a-4da1-ad0f-737f07c5a975"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6364ae70-781c-4257-82a7-61e910f5b80f"
                }],
                "bloqClass": "bloq-else-if",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-else-if-if"
                    }, {
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "938609a0-a28a-4da1-ad0f-737f07c5a975"
                    }, {
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "=",
                            "value": "=="
                        }, {
                            "label": "!=",
                            "value": "!="
                        }, {
                            "label": ">",
                            "value": ">"
                        }, {
                            "label": ">=",
                            "value": ">="
                        }, {
                            "label": "<",
                            "value": "<"
                        }, {
                            "label": "<=",
                            "value": "<="
                        }]
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6364ae70-781c-4257-82a7-61e910f5b80f"
                    }, {
                        "alias": "text",
                        "value": "bloq-else-if-else"
                    }]
                ],
                "code": "else if ({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "for-v1",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-for",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-for-count"
                    }, {
                        "id": "VAR",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "bloq-for-from"
                    }, {
                        "id": "INIT",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "bloq-for-to"
                    }, {
                        "id": "FINAL",
                        "alias": "numberInput",
                        "value": 10
                    }, {
                        "id": "MODE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-for-add",
                            "value": "+"
                        }, {
                            "label": "bloq-for-subtract",
                            "value": "-"
                        }]
                    }, {
                        "id": "ADD",
                        "alias": "numberInput",
                        "value": 1
                    }, {
                        "alias": "text",
                        "value": "bloq-for-exec"
                    }]
                ],
                "code": "'for({VAR}={INIT};{VAR}' + ('{MODE}' === '+'?'<=':'>=' ) + '{FINAL};{VAR}{MODE}={ADD}){{STATEMENTS}}'"
            }, {
                "type": "statement-input",
                "name": "if",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "b669ba84-9075-45ff-9996-632d9e45544b"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "84c4127e-26f4-41f7-ad86-7b97fefa783f"
                }],
                "bloqClass": "bloq-if",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-if-if"
                    }, {
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "b669ba84-9075-45ff-9996-632d9e45544b"
                    }, {
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "=",
                            "value": "=="
                        }, {
                            "label": "!=",
                            "value": "!="
                        }, {
                            "label": ">",
                            "value": ">"
                        }, {
                            "label": ">=",
                            "value": ">="
                        }, {
                            "label": "<",
                            "value": "<"
                        }, {
                            "label": "<=",
                            "value": "<="
                        }]
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "84c4127e-26f4-41f7-ad86-7b97fefa783f"
                    }, {
                        "alias": "text",
                        "value": "bloq-if-exec"
                    }]
                ],
                "code": "if({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}"
            }, {
                "type": "output",
                "name": "millis",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-millis",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-millis"
                    }]
                ],
                "code": "millis()",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement-input",
                "name": "switch",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-switch",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-switch-check"
                    }, {
                        "id": "VAR",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }]
                ],
                "code": "switch (int({VAR})) {{STATEMENTS}}"
            }, {
                "type": "statement",
                "name": "wait",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-wait",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-wait-wait"
                    }, {
                        "id": "TIME",
                        "alias": "numberInput",
                        "value": 2000
                    }, {
                        "alias": "text",
                        "value": "bloq-wait-ms"
                    }]
                ],
                "code": "delay({TIME});"
            }, {
                "type": "statement-input",
                "name": "while",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "7c05f62f-b5a7-45c9-9f78-90b1ec30d7ec"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "d2630662-0a65-46fe-b5f1-6e58be4cf028"
                }],
                "bloqClass": "bloq-while",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-while-while"
                    }, {
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "7c05f62f-b5a7-45c9-9f78-90b1ec30d7ec"
                    }, {
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "=",
                            "value": "=="
                        }, {
                            "label": "!=",
                            "value": "!="
                        }, {
                            "label": ">",
                            "value": ">"
                        }, {
                            "label": ">=",
                            "value": ">="
                        }, {
                            "label": "<",
                            "value": "<"
                        }, {
                            "label": "<=",
                            "value": "<="
                        }]
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "d2630662-0a65-46fe-b5f1-6e58be4cf028"
                    }, {
                        "alias": "text",
                        "value": "bloq-while-exec"
                    }]
                ],
                "code": "while ({ARG1} {OPERATOR} {ARG2}){{STATEMENTS}}"
            }, {
                "type": "output",
                "name": "numConversion",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "ad7fba5d-083c-4ebf-a4d4-a436467fb5fa"
                }],
                "bloqClass": "bloq-num-conversion",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-num-conversion"
                    }, {
                        "bloqInputId": "NUMBER",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "ad7fba5d-083c-4ebf-a4d4-a436467fb5fa"
                    }, {
                        "alias": "text",
                        "value": "bloq-num-conversion-to"
                    }, {
                        "id": "TYPE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-num-conversion-int",
                            "value": "int"
                        }, {
                            "label": "bloq-num-conversion-float",
                            "value": "float"
                        }]
                    }]
                ],
                "code": "({TYPE}) {NUMBER}",
                "returnType": {
                    "type": "fromDropdown",
                    "idDropdown": "TYPE"
                }
            }, {
                "type": "output",
                "name": "stringToInt",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "String",
                    "name": "922e61eb-81c8-432e-99a6-f9739496bce6"
                }],
                "bloqClass": "bloq-string-to-int",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-string-to-int"
                    }, {
                        "bloqInputId": "VAR",
                        "alias": "bloqInput",
                        "acceptType": "String",
                        "name": "922e61eb-81c8-432e-99a6-f9739496bce6"
                    }]
                ],
                "code": "{VAR}.toInt()",
                "returnType": {
                    "type": "simple",
                    "value": "int"
                }
            }, {
                "type": "output",
                "name": "evolutionDistance",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-evolution-distance",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-distance"
                    }]
                ],
                "code": "evolution.getDistance()",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement",
                "name": "evolutionHeadAdvance",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "5fab3bd1-037a-4448-8e14-b911b2b0a7ef"
                }],
                "bloqClass": "bloq-evolution-head",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-head-advance"
                    }, {
                        "bloqInputId": "DEGREES",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "5fab3bd1-037a-4448-8e14-b911b2b0a7ef"
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-head-advance-deg"
                    }, {
                        "id": "SIDE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-head-advance-left",
                            "value": "HEAD_LEFT"
                        }, {
                            "label": "bloq-evolution-head-advance-right",
                            "value": "HEAD_RIGHT"
                        }]
                    }]
                ],
                "code": "'{SIDE}' === 'HEAD_LEFT'? 'evolution.turnHead({DEGREES});' : 'evolution.turnHead(-{DEGREES});'"
            }, {
                "type": "output",
                "name": "evolutionLight",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-evolution-light",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-light"
                    }, {
                        "id": "SIDE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-light-left",
                            "value": "LEFT"
                        }, {
                            "label": "bloq-evolution-light-right",
                            "value": "RIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-light-evolution"
                    }]
                ],
                "code": "evolution.getLight({SIDE})",
                "returnType": {
                    "type": "simple",
                    "value": "int"
                }
            }, {
                "type": "output",
                "name": "evolutionLight",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-evolution-light",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-light"
                    }, {
                        "id": "SIDE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-light-left",
                            "value": "LEFT"
                        }, {
                            "label": "bloq-evolution-light-right",
                            "value": "RIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-light-evolution"
                    }]
                ],
                "code": "evolution.getLight({SIDE})",
                "returnType": {
                    "type": "simple",
                    "value": "int"
                }
            }, {
                "type": "output",
                "name": "evolutionLine",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-evolution-line",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-line"
                    }, {
                        "id": "SIDE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-line-left",
                            "value": "LEFT"
                        }, {
                            "label": "bloq-evolution-line-right",
                            "value": "RIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-line-evolution"
                    }]
                ],
                "code": "evolution.getLine({SIDE})",
                "returnType": {
                    "type": "simple",
                    "value": "int"
                }
            }, {
                "type": "statement",
                "name": "evolutionBuzzer",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-evolution-buzzer",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-buzzer"
                    }, {
                        "id": "NOTE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-buzzer-do",
                            "value": "note_C4"
                        }, {
                            "label": "bloq-evolution-buzzer-re",
                            "value": "note_D4"
                        }, {
                            "label": "bloq-evolution-buzzer-mi",
                            "value": "note_E4"
                        }, {
                            "label": "bloq-evolution-buzzer-fa",
                            "value": "note_F4"
                        }, {
                            "label": "bloq-evolution-buzzer-sol",
                            "value": "note_G4"
                        }, {
                            "label": "bloq-evolution-buzzer-la",
                            "value": "note_A4"
                        }, {
                            "label": "bloq-evolution-buzzer-si",
                            "value": "note_B4"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-buzzer-for"
                    }, {
                        "id": "SECONDS",
                        "alias": "numberInput",
                        "value": 1000
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-buzzer-ms"
                    }]
                ],
                "code": "evolution._tone({NOTE},{SECONDS});"
            }, {
                "type": "statement",
                "name": "evolutionHead",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-evolution-head",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-head"
                    }, {
                        "id": "SIDE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-head-center",
                            "value": "HEAD_CENTER"
                        }, {
                            "label": "bloq-evolution-head-left",
                            "value": "HEAD_LEFT"
                        }, {
                            "label": "bloq-evolution-head-right",
                            "value": "HEAD_RIGHT"
                        }]
                    }]
                ],
                "code": "evolution.turnHead({SIDE});"
            }, {
                "type": "statement",
                "name": "evolutionHome",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-evolution-rest",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-rest"
                    }]
                ],
                "code": "evolution.home();"
            }, {
                "type": "statement-input",
                "name": "evolutionIfDistance",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-evolution-if-distance",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-if-distance"
                    }, {
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-if-distance-less",
                            "value": "<"
                        }, {
                            "label": "bloq-evolution-if-distance-more",
                            "value": ">"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-if-distance-than"
                    }, {
                        "id": "DISTANCE",
                        "alias": "numberInput",
                        "value": 15
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-if-distance-then"
                    }]
                ],
                "code": "if(evolution.getDistance() {OPERATOR} {DISTANCE}){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "evolutionIfLight",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-evolution-if-light",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-if-light"
                    }, {
                        "id": "RANGELEFT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-if-light-high",
                            "value": "HIGH_LIGHT"
                        }, {
                            "label": "bloq-evolution-if-light-medium",
                            "value": "MEDIUM_LIGHT"
                        }, {
                            "label": "bloq-evolution-if-light-low",
                            "value": "LOW_LIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-if-light-and"
                    }, {
                        "id": "RANGERIGHT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-if-light-high",
                            "value": "HIGH_LIGHT"
                        }, {
                            "label": "bloq-evolution-if-light-medium",
                            "value": "MEDIUM_LIGHT"
                        }, {
                            "label": "bloq-evolution-if-light-low",
                            "value": "LOW_LIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-if-light-then"
                    }]
                ],
                "code": "if(evolution.getLightRange(LEFT,{RANGELEFT}) && evolution.getLightRange(RIGHT,{RANGERIGHT})){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "evolutionIfLine",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-evolution-if-line",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-if-line"
                    }, {
                        "id": "LINELEFT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-if-line-white",
                            "value": "1"
                        }, {
                            "label": "bloq-evolution-if-line-black",
                            "value": "0"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-if-line-and"
                    }, {
                        "id": "LINERIGHT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-if-line-white",
                            "value": "1"
                        }, {
                            "label": "bloq-evolution-if-line-black",
                            "value": "0"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-evolution-if-line-then"
                    }]
                ],
                "code": "if(evolution.getLine(LEFT) == {LINELEFT} && evolution.getLine(RIGHT) == {LINERIGHT}){{STATEMENTS}}"
            }, {
                "type": "statement",
                "name": "evolutionMovementsSimple",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-evolution-movements-simple",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-evolution-movements-simple"
                    }, {
                        "id": "MOVEMENT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-evolution-movements-simple-fordward",
                            "value": "fordward"
                        }, {
                            "label": "bloq-evolution-movements-simple-backward",
                            "value": "backward"
                        }, {
                            "label": "bloq-evolution-movements-simple-right",
                            "value": "right"
                        }, {
                            "label": "bloq-evolution-movements-simple-left",
                            "value": "left"
                        }]
                    }]
                ],
                "code": "evolution.{MOVEMENT}();"
            }, {
                "type": "output",
                "name": "argument",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-argument",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-argument-var"
                    }, {
                        "id": "TYPE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-argument-int",
                            "value": "int"
                        }, {
                            "label": "bloq-argument-float",
                            "value": "float"
                        }, {
                            "label": "bloq-argument-string",
                            "value": "String"
                        }, {
                            "label": "bloq-argument-char",
                            "value": "char"
                        }, {
                            "label": "bloq-argument-bool",
                            "value": "bool"
                        }]
                    }, {
                        "id": "VARNAME",
                        "alias": "varInput",
                        "value": ""
                    }]
                ],
                "createDynamicContent": "softwareVars",
                "code": "{TYPE} {VARNAME}",
                "returnType": {
                    "type": "fromDropdown",
                    "idDropdown": "TYPE",
                    "options": "softwareVars"
                }
            }, {
                "type": "output",
                "name": "arguments",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "234f8c9b-2516-4a8b-91a3-ef36dc764df1"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "9008562b-db71-4fb4-9b78-ed25f538a913"
                }],
                "bloqClass": "bloq-arguments",
                "content": [
                    [{
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "234f8c9b-2516-4a8b-91a3-ef36dc764df1"
                    }, {
                        "alias": "text",
                        "value": ","
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "9008562b-db71-4fb4-9b78-ed25f538a913"
                    }]
                ],
                "createDynamicContent": "softwareVars",
                "code": "{ARG1},{ARG2}",
                "returnType": {
                    "type": "simple",
                    "value": "var"
                }
            }, {
                "type": "statement",
                "name": "invokeFunctionWithArguments",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "1d77746d-da6b-4cef-88af-9a6636de5644"
                }],
                "bloqClass": "bloq-invoke-function-with-arguments",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-function-exec"
                    }, {
                        "id": "FUNCTION",
                        "alias": "dynamicDropdown",
                        "options": "voidFunctions"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-function-args"
                    }, {
                        "bloqInputId": "ARGS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "1d77746d-da6b-4cef-88af-9a6636de5644"
                    }]
                ],
                "code": "{FUNCTION}({ARGS});",
                "dynamicDropdown": {
                    "idDropdown": "FUNCTION",
                    "options": "voidFunctions"
                }
            }, {
                "type": "output",
                "name": "invokeReturnFunctionWithArguments",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "8d410e09-238d-44a5-8c20-dc2443c2d71e"
                }],
                "bloqClass": "bloq-invoke-return-function-with-arguments",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-return-function-exec"
                    }, {
                        "id": "FUNCTION",
                        "alias": "dynamicDropdown",
                        "options": "returnFunctions"
                    }, {
                        "alias": "text",
                        "value": "bloq-invoke-function-args"
                    }, {
                        "bloqInputId": "ARGS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "8d410e09-238d-44a5-8c20-dc2443c2d71e"
                    }]
                ],
                "code": "{FUNCTION}({ARGS})",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "FUNCTION",
                    "options": "returnFunctions"
                }
            }, {
                "type": "statement",
                "name": "return",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "e78e1e14-e3da-40c5-b531-88b93d274224"
                }],
                "bloqClass": "bloq-return",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-return-return"
                    }, {
                        "bloqInputId": "RETURN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "e78e1e14-e3da-40c5-b531-88b93d274224"
                    }]
                ],
                "code": "return {RETURN};"
            }, {
                "type": "statement-input",
                "name": "returnFunctionWithArguments",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "fc13f5a8-581d-486a-9c05-7edf81c4bfbe"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6806382d-c679-4f28-854d-626c8b68673d"
                }],
                "bloqClass": "bloq-return-function-with-arguments",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-return-function-with-arguments-declare"
                    }, {
                        "id": "FUNCNAME",
                        "alias": "varInput",
                        "placeholder": "bloq-functions-default"
                    }, {
                        "alias": "text",
                        "value": "bloq-return-function-with-arguments-count"
                    }, {
                        "bloqInputId": "ARGS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "fc13f5a8-581d-486a-9c05-7edf81c4bfbe"
                    }, {
                        "position": "DOWN",
                        "alias": "text",
                        "value": "bloq-return-function-with-arguments-return"
                    }, {
                        "position": "DOWN",
                        "bloqInputId": "RETURN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6806382d-c679-4f28-854d-626c8b68673d"
                    }]
                ],
                "createDynamicContent": "returnFunctions",
                "returnType": {
                    "type": "fromInput",
                    "bloqInputId": "RETURN"
                },
                "arguments": {
                    "type": "fromInput",
                    "bloqInputId": "ARGS"
                },
                "code": "{RETURN.connectionType} {FUNCNAME} ({ARGS}) {{STATEMENTS}return {RETURN};}"
            }, {
                "type": "statement-input",
                "name": "voidFunctionWithArguments",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "db39ca5a-4543-470c-88c2-1664565ebd5b"
                }],
                "bloqClass": "bloq-void-function-with-arguments",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-void-function-with-arguments-declare"
                    }, {
                        "id": "FUNCNAME",
                        "alias": "varInput",
                        "placeholder": "bloq-functions-default"
                    }, {
                        "alias": "text",
                        "value": "bloq-void-function-with-arguments-count"
                    }, {
                        "bloqInputId": "ARGS",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "db39ca5a-4543-470c-88c2-1664565ebd5b"
                    }]
                ],
                "createDynamicContent": "voidFunctions",
                "returnType": {
                    "type": "simple",
                    "value": "void"
                },
                "arguments": {
                    "type": "fromInput",
                    "bloqInputId": "ARGS"
                },
                "code": "void {FUNCNAME} ({ARGS}){{STATEMENTS}}"
            }, {
                "type": "statement",
                "name": "invokeFunction",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-invoke-function",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-function-exec"
                    }, {
                        "id": "FUNCTION",
                        "alias": "dynamicDropdown",
                        "options": "voidFunctions"
                    }]
                ],
                "code": "{FUNCTION}();",
                "dynamicDropdown": {
                    "idDropdown": "FUNCTION",
                    "options": "voidFunctions"
                }
            }, {
                "type": "output",
                "name": "invokeReturnFunction",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-invoke-return-function",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-invoke-return-function-exec"
                    }, {
                        "id": "FUNCTION",
                        "alias": "dynamicDropdown",
                        "options": "returnFunctions"
                    }]
                ],
                "code": "{FUNCTION}()",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "FUNCTION",
                    "options": "returnFunctions"
                }
            }, {
                "type": "statement-input",
                "name": "returnFunction",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "6a89324d-7f7e-447c-9591-5b4dc3bba84f"
                }],
                "bloqClass": "bloq-return-function",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-return-function-declare"
                    }, {
                        "id": "FUNCNAME",
                        "alias": "varInput",
                        "placeholder": "bloq-functions-default"
                    }, {
                        "position": "DOWN",
                        "alias": "text",
                        "value": "bloq-return-function-return"
                    }, {
                        "position": "DOWN",
                        "bloqInputId": "RETURN",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "6a89324d-7f7e-447c-9591-5b4dc3bba84f"
                    }]
                ],
                "createDynamicContent": "returnFunctions",
                "returnType": {
                    "type": "fromInput",
                    "bloqInputId": "RETURN"
                },
                "code": "{RETURN.connectionType} {FUNCNAME} () {{STATEMENTS}return {RETURN};}"
            }, {
                "type": "statement-input",
                "name": "voidFunction",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-void-function",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-void-function-declare"
                    }, {
                        "id": "FUNCNAME",
                        "alias": "varInput",
                        "placeholder": "bloq-functions-default"
                    }]
                ],
                "createDynamicContent": "voidFunctions",
                "returnType": {
                    "type": "simple",
                    "value": "void"
                },
                "code": "void {FUNCNAME} (){{STATEMENTS}}"
            }, {
                "name": "group",
                "type": "group",
                "connectors": [{
                    "type": "connector--empty"
                }, {
                    "type": "connector--empty"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }]
            }, {
                "type": "output",
                "name": "boolArrayAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "2868b3d5-c00f-4255-9102-50240c371808"
                }],
                "bloqClass": "bloq-boolArray-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-boolArray-advanced-arraySize"
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "2868b3d5-c00f-4255-9102-50240c371808"
                    }, {
                        "alias": "text",
                        "value": "bloq-boolArray-advanced-boolType"
                    }]
                ],
                "code": "(bool *)malloc({VALUE}*sizeof(bool))",
                "returnType": {
                    "type": "simple",
                    "value": "bool *"
                }
            }, {
                "type": "output",
                "name": "boolArray",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-boolArray",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-boolArray-arraySize"
                    }, {
                        "id": "VALUE",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "bloq-boolArray-boolType"
                    }]
                ],
                "code": "(bool *)malloc({VALUE}*sizeof(bool))",
                "returnType": {
                    "type": "simple",
                    "value": "bool *"
                }
            }, {
                "type": "output",
                "name": "boolean",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-boolean",
                "content": [
                    [{
                        "id": "STATE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-boolean-true",
                            "value": "true"
                        }, {
                            "label": "bloq-boolean-false",
                            "value": "false"
                        }]
                    }]
                ],
                "code": "{STATE}",
                "returnType": {
                    "type": "simple",
                    "value": "bool"
                }
            }, {
                "type": "output",
                "name": "equalityOperations",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "fe8ced8f-2cc5-4695-9875-8011a4cfb654"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "a9215b3e-7b78-450b-8aa2-271f46a6c22b"
                }],
                "bloqClass": "bloq-equality-operations",
                "content": [
                    [{
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "fe8ced8f-2cc5-4695-9875-8011a4cfb654"
                    }, {
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "=",
                            "value": "=="
                        }, {
                            "label": "!=",
                            "value": "!="
                        }, {
                            "label": ">",
                            "value": ">"
                        }, {
                            "label": ">=",
                            "value": ">="
                        }, {
                            "label": "<",
                            "value": "<"
                        }, {
                            "label": "<=",
                            "value": "<="
                        }]
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "a9215b3e-7b78-450b-8aa2-271f46a6c22b"
                    }]
                ],
                "code": "({ARG1} {OPERATOR} {ARG2})",
                "returnType": {
                    "type": "simple",
                    "value": "bool"
                }
            }, {
                "type": "output",
                "name": "logicOperations",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "80f58e5b-3dd8-4a76-ba56-4c052df192e1"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "515d6c7d-6dd8-43a4-b75d-27e48633ce87"
                }],
                "bloqClass": "bloq-logic-operations",
                "content": [
                    [{
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "80f58e5b-3dd8-4a76-ba56-4c052df192e1"
                    }, {
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-logic-operations-and",
                            "value": "&&"
                        }, {
                            "label": "bloq-logic-operations-or",
                            "value": "||"
                        }]
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "515d6c7d-6dd8-43a4-b75d-27e48633ce87"
                    }]
                ],
                "code": "({ARG1} {OPERATOR} {ARG2})",
                "returnType": {
                    "type": "simple",
                    "value": "bool"
                }
            }, {
                "type": "output",
                "name": "not",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "e5927f06-16ef-4151-99a6-12a0f11aa4a6"
                }],
                "bloqClass": "bloq-not",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-not-not"
                    }, {
                        "bloqInputId": "CONDITION",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "e5927f06-16ef-4151-99a6-12a0f11aa4a6"
                    }]
                ],
                "code": "!{CONDITION}",
                "returnType": {
                    "type": "simple",
                    "value": "bool"
                }
            }, {
                "name": "loopBloq",
                "type": "group",
                "connectors": [{
                    "type": "connector--empty"
                }, {
                    "type": "connector--empty"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-loop",
                "headerText": "bloq-loop-header",
                "descriptionText": "bloq-loop-description",
                "content": [],
                "code": "void loop(){{STATEMENTS}}"
            }, {
                "name": "setupBloq",
                "type": "group",
                "connectors": [{
                    "type": "connector--empty"
                }, {
                    "type": "connector--empty"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-setup",
                "headerText": "bloq-setup-header",
                "descriptionText": "bloq-setup-description",
                "content": [],
                "code": "void setup(){{STATEMENTS}}"
            }, {
                "name": "varsBloq",
                "type": "group",
                "connectors": [{
                    "type": "connector--empty"
                }, {
                    "type": "connector--empty"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-vars",
                "headerText": "bloq-var-header",
                "descriptionText": "bloq-var-description",
                "content": [],
                "code": "{STATEMENTS}"
            }, {
                "type": "output",
                "name": "mapAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "ac1af84a-57b0-4afe-a6ec-f12d9adee643"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "8d998d84-06eb-467a-8307-aff73c034164"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "7119dd71-2c01-4c0d-9e25-5ab86bb5eb9d"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "9e437d10-5748-404b-b99f-77078e17da48"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "ea3d8064-4fb7-47ef-9087-89711b34c734"
                }],
                "bloqClass": "bloq-map-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-map-advanced-map"
                    }, {
                        "bloqInputId": "VAR",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "ac1af84a-57b0-4afe-a6ec-f12d9adee643"
                    }, {
                        "alias": "text",
                        "value": "bloq-map-advanced-value"
                    }, {
                        "bloqInputId": "INITMIN",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "8d998d84-06eb-467a-8307-aff73c034164"
                    }, {
                        "alias": "text",
                        "value": "-"
                    }, {
                        "bloqInputId": "INITMAX",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "7119dd71-2c01-4c0d-9e25-5ab86bb5eb9d"
                    }, {
                        "alias": "text",
                        "value": "bloq-map-advanced-and"
                    }, {
                        "bloqInputId": "FINMIN",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "9e437d10-5748-404b-b99f-77078e17da48"
                    }, {
                        "alias": "text",
                        "value": "-"
                    }, {
                        "bloqInputId": "FINMAX",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "ea3d8064-4fb7-47ef-9087-89711b34c734"
                    }, {
                        "alias": "text",
                        "value": "]"
                    }]
                ],
                "code": "map({VAR},{INITMIN},{INITMAX},{FINMIN},{FINMAX})",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "mathOperations",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "79ecb7e9-343d-4751-a4cb-9fc6b7dab35a"
                }],
                "bloqClass": "bloq-math-operations",
                "content": [
                    [{
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-math-operations-sqrt",
                            "value": "sqrt"
                        }, {
                            "label": "bloq-math-operations-abs",
                            "value": "abs"
                        }, {
                            "label": "ln",
                            "value": "log"
                        }, {
                            "label": "log10",
                            "value": "log10"
                        }, {
                            "label": "e^",
                            "value": "exp"
                        }]
                    }, {
                        "bloqInputId": "ARG",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "79ecb7e9-343d-4751-a4cb-9fc6b7dab35a"
                    }]
                ],
                "code": "{OPERATOR}({ARG})",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "numberArrayAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "c4d086ad-4c48-4430-b597-6f0561cd0afb"
                }],
                "bloqClass": "bloq-numberArray-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-numberArray-advanced-arraySize"
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "c4d086ad-4c48-4430-b597-6f0561cd0afb"
                    }, {
                        "alias": "text",
                        "value": "bloq-numberArray-advanced-type"
                    }, {
                        "id": "TYPE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-numberArray-advanced-float",
                            "value": "float *"
                        }, {
                            "label": "bloq-numberArray-advanced-int",
                            "value": "int *"
                        }]
                    }]
                ],
                "code": "({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))",
                "returnType": {
                    "type": "fromDropdown",
                    "idDropdown": "TYPE",
                    "options": "softwareVars"
                }
            }, {
                "type": "output",
                "name": "basicOperations",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "d3d844e6-fece-4961-afe5-3c3afa8d69fd"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "256ab1ce-e266-4ea9-8bdf-b464b8f84462"
                }],
                "bloqClass": "bloq-basic-operations",
                "content": [
                    [{
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "d3d844e6-fece-4961-afe5-3c3afa8d69fd"
                    }, {
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "+",
                            "value": "+"
                        }, {
                            "label": "-",
                            "value": "-"
                        }, {
                            "label": "x",
                            "value": "*"
                        }, {
                            "label": "/",
                            "value": "/"
                        }, {
                            "label": "^",
                            "value": "^"
                        }, {
                            "label": "%",
                            "value": "%"
                        }]
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "256ab1ce-e266-4ea9-8bdf-b464b8f84462"
                    }]
                ],
                "code": "'{OPERATOR}' === '^'? 'pow({ARG1},{ARG2})' : '({ARG1} {OPERATOR} {ARG2})'",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "map",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "f668fa50-e6cb-4142-86f3-d81e90a00028"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "87dc794a-912a-4620-bdf2-8e8c283332f1"
                }],
                "bloqClass": "bloq-map",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-map-map"
                    }, {
                        "bloqInputId": "VAR",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "f668fa50-e6cb-4142-86f3-d81e90a00028"
                    }, {
                        "alias": "text",
                        "value": "bloq-map-value"
                    }, {
                        "bloqInputId": "MAXVAL",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "87dc794a-912a-4620-bdf2-8e8c283332f1"
                    }, {
                        "alias": "text",
                        "value": "]"
                    }]
                ],
                "code": "map({VAR},0,1023,0,{MAXVAL})",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "number",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-number",
                "content": [
                    [{
                        "id": "VALUE",
                        "alias": "numberInput",
                        "value": 0
                    }]
                ],
                "code": "{VALUE}",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "numberArray",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-numberArray",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-numberArray-arraySize"
                    }, {
                        "id": "VALUE",
                        "alias": "numberInput",
                        "value": 3
                    }, {
                        "alias": "text",
                        "value": "bloq-numberArray-floatType"
                    }]
                ],
                "code": "(float*)malloc({VALUE}*sizeof(float))",
                "returnType": {
                    "type": "simple",
                    "value": "float *"
                }
            }, {
                "type": "output",
                "name": "random",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "9017579b-e7bf-4359-9d77-1403e2787f2e"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "float",
                    "name": "db2b682f-2497-4121-8228-dbb9fc30e67e"
                }],
                "bloqClass": "bloq-random",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-random-random"
                    }, {
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "9017579b-e7bf-4359-9d77-1403e2787f2e"
                    }, {
                        "alias": "text",
                        "value": "bloq-random-and"
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "float",
                        "name": "db2b682f-2497-4121-8228-dbb9fc30e67e"
                    }]
                ],
                "code": "random({ARG1},{ARG2}+1)",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement",
                "name": "randomSeed",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-random-seed",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-random-seed"
                    }]
                ],
                "code": "randomSeed(micros());",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "output",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }]
            }, {
                "type": "statement",
                "name": "statement",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }]
            }, {
                "type": "statement-input",
                "name": "statement-input",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }]
            }, {
                "type": "output",
                "name": "char",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-string",
                "content": [
                    [{
                        "alias": "text",
                        "value": "'"
                    }, {
                        "id": "TEXT",
                        "alias": "charInput",
                        "placeholder": "bloq-char"
                    }, {
                        "alias": "text",
                        "value": "'"
                    }]
                ],
                "code": "'{TEXT}'",
                "returnType": {
                    "type": "simple",
                    "value": "char"
                }
            }, {
                "type": "output",
                "name": "stringArrayAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "cf1a7347-a448-4315-9f04-25c1d02e8e14"
                }],
                "bloqClass": "bloq-stringArray-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-stringArray-advanced-arraySize"
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "cf1a7347-a448-4315-9f04-25c1d02e8e14"
                    }, {
                        "alias": "text",
                        "value": "bloq-stringArray-advanced-type"
                    }, {
                        "id": "TYPE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-stringArray-advanced-string",
                            "value": "String *"
                        }, {
                            "label": "bloq-stringArray-advanced-char",
                            "value": "char *"
                        }]
                    }]
                ],
                "code": "({TYPE})malloc({VALUE}*sizeof({TYPE.withoutAsterisk}))",
                "returnType": {
                    "type": "fromDropdown",
                    "idDropdown": "TYPE",
                    "options": "softwareVars"
                }
            }, {
                "type": "output",
                "name": "length",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "String",
                    "name": "68be372a-404f-42ec-8771-2d766682bf28"
                }],
                "bloqClass": "bloq-length",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-length-length"
                    }, {
                        "bloqInputId": "TEXT",
                        "alias": "bloqInput",
                        "acceptType": "String",
                        "name": "68be372a-404f-42ec-8771-2d766682bf28"
                    }]
                ],
                "code": "{TEXT}.length()",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "string",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-string",
                "content": [
                    [{
                        "alias": "text",
                        "value": "\""
                    }, {
                        "id": "TEXT",
                        "alias": "stringInput",
                        "placeholder": "bloq-string-string"
                    }, {
                        "alias": "text",
                        "value": "\""
                    }]
                ],
                "code": "\"{TEXT}\"",
                "returnType": {
                    "type": "simple",
                    "value": "String"
                }
            }, {
                "type": "output",
                "name": "stringArray",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-stringArray",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-stringArray-arraySize"
                    }, {
                        "id": "VALUE",
                        "alias": "numberInput",
                        "value": 3
                    }, {
                        "alias": "text",
                        "value": "bloq-stringArray-stringType"
                    }]
                ],
                "code": "(String *)malloc({VALUE}*sizeof(String))",
                "returnType": {
                    "type": "simple",
                    "value": "String *"
                }
            }, {
                "type": "output",
                "name": "stringCreate",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "16f0a252-db82-429f-83cf-ba6994ad903f"
                }],
                "bloqClass": "bloq-string-create",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-string-create-create"
                    }, {
                        "bloqInputId": "TEXT",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "16f0a252-db82-429f-83cf-ba6994ad903f"
                    }]
                ],
                "code": "String({TEXT})",
                "returnType": {
                    "type": "simple",
                    "value": "String"
                }
            }, {
                "type": "output",
                "name": "stringSum",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "String",
                    "name": "06632220-ae90-4d0e-a332-f9247374c690"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "String",
                    "name": "eb0a1ccf-407e-4100-8862-daf46a2572d4"
                }],
                "bloqClass": "bloq-string-sum",
                "content": [
                    [{
                        "bloqInputId": "ARG1",
                        "alias": "bloqInput",
                        "acceptType": "String",
                        "name": "06632220-ae90-4d0e-a332-f9247374c690"
                    }, {
                        "alias": "text",
                        "value": "+"
                    }, {
                        "bloqInputId": "ARG2",
                        "alias": "bloqInput",
                        "acceptType": "String",
                        "name": "eb0a1ccf-407e-4100-8862-daf46a2572d4"
                    }]
                ],
                "code": "String({ARG1})+String({ARG2})",
                "returnType": {
                    "type": "simple",
                    "value": "String"
                }
            }, {
                "type": "output",
                "name": "arrayVariableAdvanced",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "48d24ee4-61eb-4f7f-b023-8ddd9ed860c1"
                }],
                "bloqClass": "bloq-array-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-array-variable-variable"
                    }, {
                        "id": "VAR",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "["
                    }, {
                        "bloqInputId": "POSITION",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "48d24ee4-61eb-4f7f-b023-8ddd9ed860c1"
                    }, {
                        "alias": "text",
                        "value": "]"
                    }]
                ],
                "code": "{VAR}[{POSITION}]",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "VAR",
                    "pointer": "true",
                    "options": "softwareVars"
                }
            }, {
                "type": "statement",
                "name": "declareVariableAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "3d8b58a3-d5bd-4d66-8e44-8b8bd229179c"
                }],
                "bloqClass": "bloq-declare-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-declare-variable-declare"
                    }, {
                        "id": "NAME",
                        "alias": "varInput",
                        "placeholder": "bloq-name-default"
                    }, {
                        "alias": "text",
                        "value": "bloq-declare-variable-declare-type"
                    }, {
                        "id": "TYPE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-declare-variable-declare-type-int",
                            "value": "int"
                        }, {
                            "label": "bloq-declare-variable-declare-type-float",
                            "value": "float"
                        }, {
                            "label": "bloq-declare-variable-declare-type-text",
                            "value": "String"
                        }, {
                            "label": "bloq-declare-variable-declare-type-char",
                            "value": "char"
                        }, {
                            "label": "bloq-declare-variable-declare-type-bool",
                            "value": "bool"
                        }]
                    }, {
                        "alias": "text",
                        "value": "="
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "3d8b58a3-d5bd-4d66-8e44-8b8bd229179c"
                    }]
                ],
                "returnType": {
                    "type": "fromDropdown",
                    "idDropdown": "TYPE"
                },
                "createDynamicContent": "softwareVars",
                "code": "{TYPE} {NAME} = {VALUE};"
            }, {
                "type": "output",
                "name": "hwVariable",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-hw-variable-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-hw-variable-advanced-variable"
                    }, {
                        "id": "COMPONENT",
                        "alias": "dynamicDropdown",
                        "options": "varComponents"
                    }]
                ],
                "code": "{COMPONENT}",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "COMPONENT",
                    "options": "varComponents"
                }
            }, {
                "type": "statement",
                "name": "setArrayVariableAdvanced",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "e6d07c2d-839c-4d5f-905b-efccb74df7c1"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "b8db72f6-ff0a-433b-9c26-021858a689da"
                }],
                "bloqClass": "bloq-set-variableArray",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-set-variableArray-variable"
                    }, {
                        "id": "NAME",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "["
                    }, {
                        "bloqInputId": "ITERATOR",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "e6d07c2d-839c-4d5f-905b-efccb74df7c1"
                    }, {
                        "alias": "text",
                        "value": "]"
                    }, {
                        "alias": "text",
                        "value": "="
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "b8db72f6-ff0a-433b-9c26-021858a689da"
                    }]
                ],
                "code": "{NAME}[{ITERATOR}] = {VALUE};"
            }, {
                "type": "output",
                "name": "arrayVariable",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-array-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-array-variable-variable"
                    }, {
                        "id": "VAR",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "["
                    }, {
                        "id": "POSITION",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "]"
                    }]
                ],
                "code": "{VAR}[{POSITION}]",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "VAR",
                    "pointer": "true",
                    "options": "softwareVars"
                }
            }, {
                "type": "statement",
                "name": "declareVariable",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": "all",
                    "name": "9efa252c-2643-4c1a-9b33-8b68de72c9be"
                }],
                "bloqClass": "bloq-declare-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-declare-variable-declare"
                    }, {
                        "id": "NAME",
                        "alias": "varInput",
                        "placeholder": "bloq-name-default"
                    }, {
                        "alias": "text",
                        "value": "="
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": "all",
                        "name": "9efa252c-2643-4c1a-9b33-8b68de72c9be"
                    }]
                ],
                "returnType": {
                    "type": "fromInput",
                    "bloqInputId": "VALUE"
                },
                "createDynamicContent": "softwareVars",
                "code": "{VALUE.connectionType} {NAME} = {VALUE};"
            }, {
                "type": "output",
                "name": "swVariable",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-sw-variable-advanced",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-sw-variable-advanced-variable"
                    }, {
                        "id": "VALUE",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }]
                ],
                "code": "{VALUE}",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "VAR",
                    "options": "softwareVars"
                }
            }, {
                "type": "output",
                "name": "selectVariable",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-select-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-select-variable-variable"
                    }, {
                        "id": "VAR",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }]
                ],
                "code": "{VAR}",
                "returnType": {
                    "type": "fromDynamicDropdown",
                    "idDropdown": "VAR",
                    "options": "softwareVars"
                }
            }, {
                "type": "statement",
                "name": "setArrayVariable",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": {
                        "type": "fromDynamicDropdown",
                        "idDropdown": "NAME",
                        "pointer": "true",
                        "options": "softwareVars"
                    },
                    "name": "dff8fb92-d5f0-4322-987a-3180d10f1bca"
                }],
                "bloqClass": "bloq-set-variableArray",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-set-variableArray-variable"
                    }, {
                        "id": "NAME",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "["
                    }, {
                        "id": "ITERATOR",
                        "alias": "numberInput",
                        "value": 0
                    }, {
                        "alias": "text",
                        "value": "]"
                    }, {
                        "alias": "text",
                        "value": "="
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": {
                            "type": "fromDynamicDropdown",
                            "idDropdown": "NAME",
                            "pointer": "true",
                            "options": "softwareVars"
                        },
                        "name": "dff8fb92-d5f0-4322-987a-3180d10f1bca"
                    }]
                ],
                "code": "{NAME}[{ITERATOR}] = {VALUE};"
            }, {
                "type": "statement",
                "name": "setVariable",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--input",
                    "accept": "connector--output",
                    "acceptType": {
                        "type": "fromDynamicDropdown",
                        "idDropdown": "NAME",
                        "options": "softwareVars"
                    },
                    "name": "32313cd8-e340-41b9-bc89-022bfb426d9a"
                }],
                "bloqClass": "bloq-set-variable",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-set-variable-variable"
                    }, {
                        "id": "NAME",
                        "alias": "dynamicDropdown",
                        "options": "softwareVars"
                    }, {
                        "alias": "text",
                        "value": "="
                    }, {
                        "bloqInputId": "VALUE",
                        "alias": "bloqInput",
                        "acceptType": {
                            "type": "fromDynamicDropdown",
                            "idDropdown": "NAME",
                            "options": "softwareVars"
                        },
                        "name": "32313cd8-e340-41b9-bc89-022bfb426d9a"
                    }]
                ],
                "code": "{NAME} = {VALUE};"
            }, {
                "type": "output",
                "name": "zowiButtons",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-zowi-buttons",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-buttons"
                    }, {
                        "id": "BUTTON",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-buttons-A",
                            "value": "PIN_AButton"
                        }, {
                            "label": "bloq-zowi-buttons-B",
                            "value": "PIN_BButton"
                        }]
                    }]
                ],
                "code": "digitalRead({BUTTON})",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "output",
                "name": "zowiDistance",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-zowi-distance",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-distance-v1"
                    }]
                ],
                "code": "zowi.getDistance()",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement",
                "name": "zowiMovementsFront",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements-front",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-movements-walk-v1"
                    }, {
                        "id": "DIR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-forward",
                            "value": "FORWARD"
                        }, {
                            "label": "bloq-zowi-movements-backward",
                            "value": "BACKWARD"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 4
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-speed-small",
                            "value": "LOW_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-medium",
                            "value": "MEDIUM_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-high",
                            "value": "HIGH_SPEED"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-endtext"
                    }]
                ],
                "code": "zowi.walk({STEPS},{SPEED},{DIR});"
            }, {
                "type": "statement",
                "name": "zowiMovementsHeightFront",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements-height-front",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-flapping-v1"
                    }, {
                        "id": "DIR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-forward",
                            "value": "FORWARD"
                        }, {
                            "label": "bloq-zowi-movements-height-backward",
                            "value": "BACKWARD"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 1
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-speed-small",
                            "value": "LOW_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-medium",
                            "value": "MEDIUM_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-high",
                            "value": "HIGH_SPEED"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-height"
                    }, {
                        "id": "HEIGHT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-small",
                            "value": "SMALL_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-medium",
                            "value": "MEDIUM_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-big",
                            "value": "BIG_HEIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-endtext"
                    }]
                ],
                "code": "zowi.flapping({STEPS},{SPEED},{HEIGHT},{DIR});"
            }, {
                "type": "statement",
                "name": "zowiMovementsHeightSides",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements-height-sides",
                "content": [
                    [{
                        "id": "MOVEMENT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-moonwalker-v1",
                            "value": "moonwalker"
                        }, {
                            "label": "bloq-zowi-movements-height-crusaito-v1",
                            "value": "crusaito"
                        }]
                    }, {
                        "id": "DIR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-left",
                            "value": "LEFT"
                        }, {
                            "label": "bloq-zowi-movements-height-right",
                            "value": "RIGHT"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 1
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-speed-small",
                            "value": "LOW_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-medium",
                            "value": "MEDIUM_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-high",
                            "value": "HIGH_SPEED"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-height"
                    }, {
                        "id": "HEIGHT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-small",
                            "value": "SMALL_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-medium",
                            "value": "MEDIUM_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-big",
                            "value": "BIG_HEIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-endtext"
                    }]
                ],
                "code": "zowi.{MOVEMENT}({STEPS},{SPEED},{HEIGHT},{DIR});"
            }, {
                "type": "statement",
                "name": "zowiMovementsNoDir-v1",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements-no-dir-v1",
                "content": [
                    [{
                        "id": "MOVEMENT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-no-dir-updown-v1",
                            "value": "updown"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-swing-v1",
                            "value": "swing"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-tiptoeSwing-v1",
                            "value": "tiptoeSwing"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-jitter-v1",
                            "value": "jitter"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-ascendingTurn-v1",
                            "value": "ascendingTurn"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 4
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-no-dir-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-speed-small",
                            "value": "LOW_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-medium",
                            "value": "MEDIUM_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-high",
                            "value": "HIGH_SPEED"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-no-dir-height"
                    }, {
                        "id": "HEIGHT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-small",
                            "value": "SMALL_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-medium",
                            "value": "MEDIUM_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-big",
                            "value": "BIG_HEIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-no-dir-endtext"
                    }]
                ],
                "code": "zowi.{MOVEMENT}({STEPS},{SPEED},{HEIGHT});"
            }, {
                "type": "statement",
                "name": "zowiMovementsSides",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements-sides",
                "content": [
                    [{
                        "id": "MOVEMENT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-turn-v1",
                            "value": "turn"
                        }, {
                            "label": "bloq-zowi-movements-shakeLeg-v1",
                            "value": "shakeLeg"
                        }, {
                            "label": "bloq-zowi-movements-bend-v1",
                            "value": "bend"
                        }]
                    }, {
                        "id": "DIR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-left",
                            "value": "LEFT"
                        }, {
                            "label": "bloq-zowi-movements-right",
                            "value": "RIGHT"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 4
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-speed-small",
                            "value": "LOW_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-medium",
                            "value": "MEDIUM_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-high",
                            "value": "HIGH_SPEED"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-endtext"
                    }]
                ],
                "code": "zowi.{MOVEMENT}({STEPS},{SPEED},{DIR});"
            }, {
                "type": "output",
                "name": "zowiSound",
                "connectors": [{
                    "type": "connector--output",
                    "accept": "connector--input"
                }],
                "bloqClass": "bloq-zowi-sound",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-sound-v1"
                    }]
                ],
                "code": "zowi.getNoise()",
                "returnType": {
                    "type": "simple",
                    "value": "float"
                }
            }, {
                "type": "statement",
                "name": "zowiMovements",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-movements"
                    }, {
                        "id": "MOVEMENT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-walk",
                            "value": "walk"
                        }, {
                            "label": "bloq-zowi-movements-turn",
                            "value": "turn"
                        }, {
                            "label": "bloq-zowi-movements-shakeLeg",
                            "value": "shakeLeg"
                        }, {
                            "label": "bloq-zowi-movements-bend",
                            "value": "bend"
                        }]
                    }, {
                        "id": "DIR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-forward",
                            "value": "FORWARD"
                        }, {
                            "label": "bloq-zowi-movements-backward",
                            "value": "BACKWARD"
                        }, {
                            "label": "bloq-zowi-movements-left",
                            "value": "LEFT"
                        }, {
                            "label": "bloq-zowi-movements-right",
                            "value": "RIGHT"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 4
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-speed-small",
                            "value": "LOW_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-medium",
                            "value": "MEDIUM_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-high",
                            "value": "HIGH_SPEED"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-endtext"
                    }]
                ],
                "code": "zowi.{MOVEMENT}({STEPS},{SPEED},{DIR});"
            }, {
                "type": "statement",
                "name": "zowiMovementsHeight",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements-height",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-movements-height"
                    }, {
                        "id": "MOVEMENT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-moonwalker",
                            "value": "moonwalker"
                        }, {
                            "label": "bloq-zowi-movements-height-crusaito",
                            "value": "crusaito"
                        }, {
                            "label": "bloq-zowi-movements-height-flapping",
                            "value": "flapping"
                        }]
                    }, {
                        "id": "DIR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-forward",
                            "value": "FORWARD"
                        }, {
                            "label": "bloq-zowi-movements-height-backward",
                            "value": "BACKWARD"
                        }, {
                            "label": "bloq-zowi-movements-height-left",
                            "value": "LEFT"
                        }, {
                            "label": "bloq-zowi-movements-height-right",
                            "value": "RIGHT"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 1
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-speed-small",
                            "value": "LOW_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-medium",
                            "value": "MEDIUM_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-high",
                            "value": "HIGH_SPEED"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-height"
                    }, {
                        "id": "HEIGHT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-small",
                            "value": "SMALL_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-medium",
                            "value": "MEDIUM_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-big",
                            "value": "BIG_HEIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-height-endtext"
                    }]
                ],
                "code": "zowi.{MOVEMENT}({STEPS},{SPEED},{HEIGHT},{DIR});"
            }, {
                "type": "statement",
                "name": "zowiMovementsNoDir",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements-no-dir",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-movements-no-dir"
                    }, {
                        "id": "MOVEMENT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-no-dir-updown",
                            "value": "updown"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-swing",
                            "value": "swing"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-tiptoeSwing",
                            "value": "tiptoeSwing"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-jitter",
                            "value": "jitter"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-ascendingTurn",
                            "value": "ascendingTurn"
                        }, {
                            "label": "bloq-zowi-movements-no-dir-jump",
                            "value": "jump"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 4
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-no-dir-speed"
                    }, {
                        "id": "SPEED",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-speed-small",
                            "value": "LOW_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-medium",
                            "value": "MEDIUM_SPEED"
                        }, {
                            "label": "bloq-zowi-movements-speed-high",
                            "value": "HIGH_SPEED"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-no-dir-height"
                    }, {
                        "id": "HEIGHT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-height-small",
                            "value": "SMALL_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-medium",
                            "value": "MEDIUM_HEIGHT"
                        }, {
                            "label": "bloq-zowi-movements-height-big",
                            "value": "BIG_HEIGHT"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-no-dir-endtext"
                    }]
                ],
                "code": "zowi.{MOVEMENT}({STEPS},{SPEED},{HEIGHT});"
            }, {
                "type": "statement",
                "name": "zowiGestures",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-gestures",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-gestures-v1"
                    }, {
                        "id": "GESTURE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-gestures-ZowiHappy-v1",
                            "value": "ZowiHappy"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiSuperHappy-v1",
                            "value": "ZowiSuperHappy"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiSad-v1",
                            "value": "ZowiSad"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiSleeping-v1",
                            "value": "ZowiSleeping"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiFart-v1",
                            "value": "ZowiFart"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiConfused-v1",
                            "value": "ZowiConfused"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiLove-v1",
                            "value": "ZowiLove"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiAngry-v1",
                            "value": "ZowiAngry"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiFretful-v1",
                            "value": "ZowiFretful"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiVictory-v1",
                            "value": "ZowiVictory"
                        }, {
                            "label": "bloq-zowi-gestures-ZowiFail-v1",
                            "value": "ZowiFail"
                        }]
                    }]
                ],
                "code": "zowi.playGesture({GESTURE});"
            }, {
                "type": "statement",
                "name": "zowiHome",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-rest",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-rest-v1"
                    }]
                ],
                "code": "zowi.home();"
            }, {
                "type": "statement-input",
                "name": "zowiIfButtons",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-if-buttons",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-if-buttons"
                    }, {
                        "id": "BUTTON",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "A",
                            "value": "PIN_AButton"
                        }, {
                            "label": "B",
                            "value": "PIN_BButton"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-if-buttons-then-v1"
                    }]
                ],
                "code": "if(digitalRead({BUTTON}) == 1){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "zowiIfDistance",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-if-distance",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-if-distance"
                    }, {
                        "id": "OPERATOR",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-if-distance-less",
                            "value": "<"
                        }, {
                            "label": "bloq-zowi-if-distance-more",
                            "value": ">"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-if-distance-than"
                    }, {
                        "id": "DISTANCE",
                        "alias": "numberInput",
                        "value": 15
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-if-distance-then-v1"
                    }]
                ],
                "code": "if(zowi.getDistance() {OPERATOR} {DISTANCE}){{STATEMENTS}}"
            }, {
                "type": "statement-input",
                "name": "zowiIfSound",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }, {
                    "type": "connector--root",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-if-sound",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-if-sound-v1"
                    }]
                ],
                "code": " if(zowi.getNoise() >= 650){{STATEMENTS}}"
            }, {
                "type": "statement",
                "name": "zowiMouth",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-mouth",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-mouth-v1"
                    }, {
                        "id": "GESTURE",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-mouth-smile",
                            "value": "smile_code"
                        }, {
                            "label": "bloq-zowi-mouth-sad",
                            "value": "sad_code"
                        }, {
                            "label": "bloq-zowi-mouth-happy",
                            "value": "happyOpen_code"
                        }, {
                            "label": "bloq-zowi-mouth-confused",
                            "value": "confused_code"
                        }, {
                            "label": "bloq-zowi-mouth-bigSurprise",
                            "value": "bigSurprise_code"
                        }, {
                            "label": "bloq-zowi-mouth-tongueOut",
                            "value": "tongueOut_code"
                        }]
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-mouth-mouth"
                    }]
                ],
                "code": "zowi.putMouth({GESTURE}, false);"
            }, {
                "type": "statement",
                "name": "zowiMovementsSimple",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-movements-simple",
                "content": [
                    [{
                        "id": "MOVEMENT",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-movements-simple-walk-v1",
                            "value": "walk"
                        }, {
                            "label": "bloq-zowi-movements-simple-turn-v1",
                            "value": "turn"
                        }, {
                            "label": "bloq-zowi-movements-simple-shakeLeg-v1",
                            "value": "shakeLeg"
                        }, {
                            "label": "bloq-zowi-movements-simple-bend-v1",
                            "value": "bend"
                        }, {
                            "label": "bloq-zowi-movements-simple-moonwalker-v1",
                            "value": "moonwalker"
                        }, {
                            "label": "bloq-zowi-movements-simple-crusaito-v1",
                            "value": "crusaito"
                        }, {
                            "label": "bloq-zowi-movements-simple-flapping-v1",
                            "value": "flapping"
                        }, {
                            "label": "bloq-zowi-movements-simple-updown-v1",
                            "value": "updown"
                        }, {
                            "label": "bloq-zowi-movements-simple-swing-v1",
                            "value": "swing"
                        }, {
                            "label": "bloq-zowi-movements-simple-tiptoeSwing-v1",
                            "value": "tiptoeSwing"
                        }, {
                            "label": "bloq-zowi-movements-simple-jitter-v1",
                            "value": "jitter"
                        }, {
                            "label": "bloq-zowi-movements-simple-ascendingTurn-v1",
                            "value": "ascendingTurn"
                        }, {
                            "label": "bloq-zowi-movements-simple-jump-v1",
                            "value": "jump"
                        }]
                    }, {
                        "id": "STEPS",
                        "alias": "numberInput",
                        "value": 4
                    }, {
                        "alias": "text",
                        "value": "bloq-zowi-movements-simple-steps"
                    }]
                ],
                "code": "zowi.{MOVEMENT}({STEPS});"
            }, {
                "type": "statement",
                "name": "zowiSounds",
                "connectors": [{
                    "type": "connector--top",
                    "accept": "connector--bottom"
                }, {
                    "type": "connector--bottom",
                    "accept": "connector--top"
                }],
                "bloqClass": "bloq-zowi-sounds",
                "content": [
                    [{
                        "alias": "text",
                        "value": "bloq-zowi-sounds-v1"
                    }, {
                        "id": "SOUND",
                        "alias": "staticDropdown",
                        "options": [{
                            "label": "bloq-zowi-sounds-surprise",
                            "value": "S_surprise"
                        }, {
                            "label": "bloq-zowi-sounds-OhOoh",
                            "value": "S_OhOoh"
                        }, {
                            "label": "bloq-zowi-sounds-cuddly",
                            "value": "S_cuddly"
                        }, {
                            "label": "bloq-zowi-sounds-sleeping",
                            "value": "S_sleeping"
                        }, {
                            "label": "bloq-zowi-sounds-happy",
                            "value": "S_happy"
                        }, {
                            "label": "bloq-zowi-sounds-sad",
                            "value": "S_sad"
                        }, {
                            "label": "bloq-zowi-sounds-confused",
                            "value": "S_confused"
                        }, {
                            "label": "bloq-zowi-sounds-fart1-v1",
                            "value": "S_fart1"
                        }]
                    }]
                ],
                "code": "zowi.sing({SOUND});"
            })
            .then(function() {
                console.log('finished populating bloqs');
            });
    });

Category.find({}).removeAsync()
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

Property.find({}).removeAsync()
    .then(function() {
        return Property.createAsync({
                "web2boardVersion": "1.0.0",
                "bitbloqLibsVersion": "0.1.0",
                "bloqsSortTree": {
                    "components": [{
                        "name": "hts221Temperature",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "hts221Humidity",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "buzzer",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "continuousServoStart",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "continuousServoStop",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "lcdTurnOnOff",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "lcdWrite",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "lcdWritePosition",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "lcdClear",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "led",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "rgbLedSimple",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "rgbLed",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "rgbLedFade",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "clockRTCInit",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "clockRTC",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "clockRTCAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "oscillator",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "oscillatorStart",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "oscillatorStop",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "readSensor",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "servoNormal",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "serialReceive",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "serialSend-v1",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedComponents": [{
                        "name": "hwVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "buzzerAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "continuousServoStartAdvanced-v1",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "continuousServoStopAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "lcdTurnOnOffAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "lcdWriteAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "ledAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "rgbLedAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "oscillatorAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "oscillatorStartAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "oscillatorStopAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "digitalReadAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "analogReadAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "analogWrite",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "digitalWrite",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "readAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "servoNormalAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "servoAttach",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "servoDetach",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "turnOnOffAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "lcdWritePositionAdvanced-v1",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "functions": [{
                        "name": "voidFunction",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeFunction",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "returnFunction",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeReturnFunction",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedFunctions": [{
                        "name": "voidFunctionWithArguments",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeFunctionWithArguments",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "returnFunctionWithArguments",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeReturnFunctionWithArguments",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "argument",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "arguments",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "return",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "variables": [{
                        "name": "declareVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "selectVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "setVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "arrayVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "setArrayVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedVariables": [{
                        "name": "arrayVariableAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "setArrayVariableAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "declareVariableAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "codes": [{
                        "name": "comment",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "code",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "classes": [{
                        "name": "class",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeClass",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "constructorClass",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeClassFunction",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeClassReturnFunction",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "setClassVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "selectClassVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedClasses": [{
                        "name": "classChildren",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "constructorClassArguments",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeArgumentsClass",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "public",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "protected",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "private",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeClassFunctionWithArguments",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "invokeClassReturnFunctionWithArguments",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "arrayClassVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "setClassArrayVariable",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "mathematics": [{
                        "name": "number",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "numberArray",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "basicOperations",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "map",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "randomSeed",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "random",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedMathematics": [{
                        "name": "mathOperations",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "numberArrayAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "mapAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "numConversion",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "texts": [{
                        "name": "string",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "stringArray",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "length",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "stringCreate",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "stringSum",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedText": [{
                        "name": "stringArrayAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "char",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "controls": [{
                        "name": "wait",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "millis",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "if",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "elseif",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "else",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "switch",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "case",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "caseDefault",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "for-v1",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "while",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedControls": [{
                        "name": "waitAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "ifAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "elseifAdvanced",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "else",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "forAdvanced-v1",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "switchAdvanced-v2",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "caseAdvanced-v1",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "caseDefault",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "whileAdvanced",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "continue",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }, {
                        "name": "break",
                        "addClass": "submenu__item submenu__item--component indent-1"
                    }],
                    "logics": [{
                        "name": "boolean",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "boolArray",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "not",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "equalityOperations",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "logicOperations",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "zowi": [{
                        "name": "zowiHome",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiMovementsSimple",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiGestures",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiMouth",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiSounds",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiIfButtons",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiIfSound",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiIfDistance",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedZowis": [{
                        "name": "zowiMovementsFront",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiMovementsSides",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiMovementsHeightFront",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiMovementsHeightSides",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiMovementsNoDir-v1",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiButtons",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiSound",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "zowiDistance",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "evolution": [{
                        "name": "evolutionHome",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionMovementsSimple",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionHead",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionBuzzer",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionIfLine",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionIfLight",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionIfDistance",
                        "addClass": "submenu__item submenu__item--component"
                    }],
                    "advancedEvolution": [{
                        "name": "evolutionHeadAdvance",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionLine",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionLight",
                        "addClass": "submenu__item submenu__item--component"
                    }, {
                        "name": "evolutionDistance",
                        "addClass": "submenu__item submenu__item--component"
                    }]
                }
            })
            .then(function() {
                console.log('finished populating properties');
            });
    });