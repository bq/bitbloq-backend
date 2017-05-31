'use strict';

var Board = require('./board/board.model'),
    Component = require('./component/component.model'),
    Kit = require('./kit/kit.model'),
    Robot = require('./robot/robot.model'),
    _ = require('lodash'),
    async = require('async');

function createBoards(next) {
    Board.find({}).remove(function() {
        Board.create({
            "uuid": "bqZUM",
            "mcu": "bt328",
            "vendorIds": ["0x403"],
            "productIds": ["0x6001"],
            "order": 1,
            "integratedComponents": [{
                "id": "bt",
                "name": "default-var-name-standard_integrated_bt",
                "pin": {
                    "rx": "0",
                    "tx": "1"
                },
                "baudRate": "19200",
                "uid": "bq-bqzum-bt"
            }],
            "showInToolbox": true,
            "pinSize": {
                "digital": {
                    "w": 9,
                    "h": 37
                },
                "analog": {
                    "w": 9,
                    "h": 37
                },
                "serial": {
                    "w": 15,
                    "h": 35
                },
                "i2c-4": {
                    "w": 9,
                    "h": 9
                },
                "i2c-5": {
                    "w": 9,
                    "h": 9
                }
            },
            "pins": {
                "digital": [{
                    "x": 0.435,
                    "y": 0.175,
                    "name": "13",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd00"
                }, {
                    "x": 0.470,
                    "y": 0.175,
                    "name": "12",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd01"
                }, {
                    "x": 0.507,
                    "y": 0.175,
                    "name": "11",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd02"
                }, {
                    "x": 0.539,
                    "y": 0.175,
                    "name": "10",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd03"
                }, {
                    "x": 0.575,
                    "y": 0.175,
                    "name": "9",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd04"
                }, {
                    "x": 0.609,
                    "y": 0.175,
                    "name": "8",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd05"
                }, {
                    "x": 0.662,
                    "y": 0.175,
                    "name": "7",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd06"
                }, {
                    "x": 0.698,
                    "y": 0.175,
                    "name": "6",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd07"
                }, {
                    "x": 0.733,
                    "y": 0.175,
                    "name": "5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd08"
                }, {
                    "x": 0.767,
                    "y": 0.175,
                    "name": "4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd09"
                }, {
                    "x": 0.802,
                    "y": 0.175,
                    "name": "3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd10"
                }, {
                    "x": 0.837,
                    "y": 0.175,
                    "name": "2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd11"
                }, {
                    "x": 0.871,
                    "y": 0.175,
                    "name": "1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd12"
                }, {
                    "x": 0.907,
                    "y": 0.175,
                    "name": "0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bd13"
                }],
                "analog": [{
                    "x": 0.844,
                    "y": 0.785,
                    "name": "A5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ba00"
                }, {
                    "x": 0.81,
                    "y": 0.785,
                    "name": "A4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ba01"
                }, {
                    "x": 0.775,
                    "y": 0.785,
                    "name": "A3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ba02"
                }, {
                    "x": 0.741,
                    "y": 0.785,
                    "name": "A2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ba03"
                }, {
                    "x": 0.705,
                    "y": 0.785,
                    "name": "A1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ba04"
                }, {
                    "x": 0.67,
                    "y": 0.785,
                    "name": "A0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ba05"
                }],
                "serial": [{
                    "x": 0.078,
                    "y": 0.505,
                    "name": "serial",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53bc05"
                }],
                "i2c-4": [{
                    "x": 0.81,
                    "y": 0.734,
                    "name": "A4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53b201"
                }, {
                    "x": 0.869,
                    "y": 0.913,
                    "name": "A4-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53b203"
                }],
                "i2c-5": [{
                    "x": 0.844,
                    "y": 0.734,
                    "name": "A5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53b200"
                }, {
                    "x": 0.903,
                    "y": 0.913,
                    "name": "A5-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53b202"
                }]
            }
        }, {
            "uuid": "FreaduinoUNO",
            "mcu": "uno",
            "vendorIds": ["0x2341"],
            "productIds": ["0x1"],
            "showInToolbox": true,
            "order": 2,
            "pinSize": {
                "digital": {
                    "w": 9,
                    "h": 37
                },
                "analog": {
                    "w": 9,
                    "h": 37
                },
                "serial": {
                    "w": 25,
                    "h": 37
                },
                "i2c-4": {
                    "w": 9,
                    "h": 9
                },
                "i2c-5": {
                    "w": 9,
                    "h": 9
                }
            },
            "pins": {
                "digital": [{
                    "x": 0.476,
                    "y": 0.172,
                    "name": "13",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd00"
                }, {
                    "x": 0.507,
                    "y": 0.172,
                    "name": "12",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd01"
                }, {
                    "x": 0.541,
                    "y": 0.172,
                    "name": "11",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd02"
                }, {
                    "x": 0.575,
                    "y": 0.172,
                    "name": "10",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd03"
                }, {
                    "x": 0.607,
                    "y": 0.172,
                    "name": "9",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd04"
                }, {
                    "x": 0.639,
                    "y": 0.172,
                    "name": "8",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd05"
                }, {
                    "x": 0.672,
                    "y": 0.172,
                    "name": "7",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd06"
                }, {
                    "x": 0.702,
                    "y": 0.172,
                    "name": "6",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd07"
                }, {
                    "x": 0.738,
                    "y": 0.172,
                    "name": "5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd08"
                }, {
                    "x": 0.77,
                    "y": 0.172,
                    "name": "4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd09"
                }, {
                    "x": 0.807,
                    "y": 0.172,
                    "name": "3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd10"
                }, {
                    "x": 0.838,
                    "y": 0.172,
                    "name": "2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd11"
                }, {
                    "x": 0.87,
                    "y": 0.172,
                    "name": "1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd12"
                }, {
                    "x": 0.904,
                    "y": 0.172,
                    "name": "0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fd13"
                }],
                "analog": [{
                    "x": 0.661,
                    "y": 0.79,
                    "name": "A0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fa00"
                }, {
                    "x": 0.692,
                    "y": 0.79,
                    "name": "A1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fa01"
                }, {
                    "x": 0.728,
                    "y": 0.79,
                    "name": "A2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fa02"
                }, {
                    "x": 0.76,
                    "y": 0.79,
                    "name": "A3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fa03"
                }, {
                    "x": 0.793,
                    "y": 0.79,
                    "name": "A4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fa04"
                }, {
                    "x": 0.825,
                    "y": 0.79,
                    "name": "A5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fa05"
                }],
                "serial": [{
                    "x": 0.058,
                    "y": 0.218,
                    "name": "serial",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53fc05"
                }],
                "i2c-4": [{
                    "x": 0.793,
                    "y": 0.734,
                    "name": "A4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53f201"
                }, {
                    "x": 0.879,
                    "y": 0.923,
                    "name": "A4-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53f203"
                }],
                "i2c-5": [{
                    "x": 0.825,
                    "y": 0.734,
                    "name": "A5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53f200"
                }, {
                    "x": 0.913,
                    "y": 0.923,
                    "name": "A5-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53f202"
                }]
            }
        }, {
            "uuid": "ArduinoUNO",
            "mcu": "uno",
            "vendorIds": ["0x2341"],
            "productIds": ["0x43"],
            "showInToolbox": true,
            "order": 3,
            "pinSize": {
                "digital": {
                    "w": 9,
                    "h": 15
                },
                "analog": {
                    "w": 9,
                    "h": 15
                },
                "serial": {
                    "w": 33,
                    "h": 66
                },
                "i2c-4": {
                    "w": 9,
                    "h": 9
                },
                "i2c-5": {
                    "w": 9,
                    "h": 9
                }
            },
            "pins": {
                "digital": [{
                    "x": 0.478,
                    "y": 0.098,
                    "name": "13",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad00"
                }, {
                    "x": 0.508,
                    "y": 0.098,
                    "name": "12",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad01"
                }, {
                    "x": 0.545,
                    "y": 0.098,
                    "name": "11",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad02"
                }, {
                    "x": 0.58,
                    "y": 0.098,
                    "name": "10",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad03"
                }, {
                    "x": 0.615,
                    "y": 0.098,
                    "name": "9",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad04"
                }, {
                    "x": 0.649,
                    "y": 0.098,
                    "name": "8",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad05"
                }, {
                    "x": 0.695,
                    "y": 0.098,
                    "name": "7",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad06"
                }, {
                    "x": 0.73,
                    "y": 0.098,
                    "name": "6",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad07"
                }, {
                    "x": 0.765,
                    "y": 0.098,
                    "name": "5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad08"
                }, {
                    "x": 0.795,
                    "y": 0.098,
                    "name": "4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad9"
                }, {
                    "x": 0.832,
                    "y": 0.098,
                    "name": "3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad10"
                }, {
                    "x": 0.869,
                    "y": 0.098,
                    "name": "2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad11"
                }, {
                    "x": 0.9,
                    "y": 0.098,
                    "name": "1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad12"
                }, {
                    "x": 0.935,
                    "y": 0.098,
                    "name": "0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad13"
                }],
                "analog": [{
                    "x": 0.763,
                    "y": 0.92,
                    "name": "A0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa00"
                }, {
                    "x": 0.795,
                    "y": 0.92,
                    "name": "A1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa01"
                }, {
                    "x": 0.83,
                    "y": 0.92,
                    "name": "A2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa02"
                }, {
                    "x": 0.862,
                    "y": 0.92,
                    "name": "A3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa03"
                }, {
                    "x": 0.895,
                    "y": 0.92,
                    "name": "A4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa04"
                }, {
                    "x": 0.935,
                    "y": 0.92,
                    "name": "A5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa05"
                }],
                "serial": [{
                    "x": 0.045,
                    "y": 0.315,
                    "name": "serial",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ac05"
                }],
                "i2c-4": [{
                    "x": 0.903,
                    "y": 0.925,
                    "name": "A4-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53a201"
                }],
                "i2c-5": [{
                    "x": 0.933,
                    "y": 0.925,
                    "name": "A5-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53a200"
                }]
            }
        }, {
            "uuid": "mcore",
            "mcu": "uno",
            "manufacturer": "makeblock",
            "vendorIds": ["0x1A86"],
            "productIds": ["0x7523"],
            "showInToolbox": false,
            "order": 7,
            "underDevelopment": false,
            "availableComponents": [
                'mkb_infrared',
                'mkb_lightsensor',
                'mkb_joystick',
                'mkb_bluetooth',
                'mkb_linefollower',
                'mkb_ultrasound',
                'mkb_soundsensor',
                'mkb_display7seg',
                'mkb_remote',
                'sp'
            ],
            "integratedComponents": [{
                "id": "mkb_integrated_analogPinButton",
                "name": "default-var-name-mkb_integrated_analogPinButton",
                "pin": {
                    "s": "A7"
                },
                "uid": "mkb-mcore-button"
            }, {
                "id": "mkb_integrated_lightsensor",
                "name": "default-var-name-mkb_integrated_lightsensor",
                "pin": {
                    "s": 0
                },
                "uid": "mkb-mcore-ldrs"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_both",
                "pin": {
                    "s": 0
                },
                "uid": "mkb-mcore-RGBled-0"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_right",
                "pin": {
                    "s": 1
                },
                "uid": "mkb-mcore-RGBled-1"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_left",
                "pin": {
                    "s": 2
                },
                "uid": "mkb-mcore-RGBled-2"
            }, {
                "id": "mkb_integrated_buzz",
                "name": "default-var-name-mkb_integrated_buzz",
                "pin": {
                    "s": 8
                },
                "uid": "mkb-mcore-buzz"
            }],
            "pinSize": {
                "yellow blue white": {
                    "w": 37,
                    "h": 38
                },
                "yellow blue black white": {
                    "w": 37,
                    "h": 38
                },
                "serial": {
                    "w": 38,
                    "h": 38
                },
                "wireless": {
                    "h": 65,
                    "w": 11
                }
            },
            "pins": {
                "yellow blue white": [{
                    "x": 0.57,
                    "y": 0.171,
                    "name": "1",
                    "uid": "mcore-yellowBlueWhite-1"
                }, {
                    "x": 0.701,
                    "y": 0.171,
                    "name": "2",
                    "uid": "mcore-yellowBlueWhite-2"
                }],
                "yellow blue black white": [{
                    "x": 0.701,
                    "y": 0.9,
                    "name": "3",
                    "uid": "mcore-yellowBlueBlackWhite-3"
                }, {
                    "x": 0.57,
                    "y": 0.9,
                    "name": "4",
                    "uid": "mcore-yellowBlueBlackWhite-4"
                }],
                "serial": [{
                    "x": 0.35,
                    "y": 0.9,
                    "name": "serial",
                    "uid": "mcore-serial"
                }],
                "wireless": [{
                    "uid": "mcore-wireless",
                    "name": "wireless",
                    "y": 0.635,
                    "x": 0.109
                }]
            }
        }, {
            "uuid": "meauriga",
            "mcu": "mega",
            "manufacturer": "makeblock",
            "vendorIds": ["0x1A86"],
            "productIds": ["0x7523"],
            "underDevelopment": false,
            "showInToolbox": false,
            "order": 8,
            "availableComponents": [
                'mkb_infrared',
                'mkb_lightsensor',
                'mkb_bluetooth',
                'mkb_joystick',
                'mkb_linefollower',
                'mkb_ultrasound',
                'mkb_display7seg',
                'sp'
            ],
            "integratedComponents": [{
                "id": "mkb_integrated_lightsensor",
                "name": "default-var-name-mkb_integrated_lightsensor_1",
                "pin": {
                    "s": 1
                },
                "uid": "mkb-meauriga-ldrs-1"
            }, {
                "id": "mkb_integrated_lightsensor",
                "name": "default-var-name-mkb_integrated_lightsensor_2",
                "pin": {
                    "s": 2
                },
                "uid": "mkb-meauriga-ldrs-2"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_all",
                "pin": {
                    "s": 0
                },
                "uid": "mkb-meauriga-RGBled-0"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_1",
                "pin": {
                    "s": 1
                },
                "uid": "mkb-meauriga-RGBled-1"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_2",
                "pin": {
                    "s": 2
                },
                "uid": "mkb-meauriga-RGBled-2"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_3",
                "pin": {
                    "s": 3
                },
                "uid": "mkb-meauriga-RGBled-3"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_4",
                "pin": {
                    "s": 4
                },
                "uid": "mkb-meauriga-RGBled-4"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_5",
                "pin": {
                    "s": 5
                },
                "uid": "mkb-meauriga-RGBled-5"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_6",
                "pin": {
                    "s": 6
                },
                "uid": "mkb-meauriga-RGBled-6"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_7",
                "pin": {
                    "s": 7
                },
                "uid": "mkb-meauriga-RGBled-7"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_8",
                "pin": {
                    "s": 8
                },
                "uid": "mkb-meauriga-RGBled-8"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_9",
                "pin": {
                    "s": 9
                },
                "uid": "mkb-meauriga-RGBled-9"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_10",
                "pin": {
                    "s": 10
                },
                "uid": "mkb-meauriga-RGBled-10"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_11",
                "pin": {
                    "s": 11
                },
                "uid": "mkb-meauriga-RGBled-11"
            }, {
                "id": "mkb_integrated_RGB",
                "name": "default-var-name-mkb_integrated_rgb_12",
                "pin": {
                    "s": 12
                },
                "uid": "mkb-meauriga-RGBled-12"
            }, {
                "id": "mkb_integrated_buzz",
                "name": "default-var-name-mkb_integrated_buzz",
                "pin": {
                    "s": 45
                },
                "uid": "mkb-meauriga-buzz"
            }],
            "pinSize": {
                "red": {
                    "w": 45,
                    "h": 45
                },
                "grey": {
                    "w": 45,
                    "h": 45
                },
                "yellow blue black white": {
                    "w": 45,
                    "h": 45
                },
                "serial": {
                    "w": 46,
                    "h": 40
                }
            },
            "pins": {
                "red": [{
                    "x": 0.33,
                    "y": 0.86,
                    "name": "1",
                    "uid": "meauriga-red-1"
                }, {
                    "x": 0.48,
                    "y": 0.86,
                    "name": "2",
                    "uid": "meauriga-red-2"
                }, {
                    "x": 0.63,
                    "y": 0.86,
                    "name": "3",
                    "uid": "meauriga-red-3"
                }, {
                    "x": 0.78,
                    "y": 0.86,
                    "name": "4",
                    "uid": "meauriga-red-4"
                }],
                "grey": [{
                    "x": 0.925,
                    "y": 0.86,
                    "name": "5",
                    "uid": "meauriga-grey-5"
                }],
                "yellow blue black white": [{
                    "x": 0.925,
                    "y": 0.13,
                    "name": "6",
                    "uid": "meauriga-yellowBlueBlackWhite-6"
                }, {
                    "x": 0.78,
                    "y": 0.13,
                    "name": "7",
                    "uid": "meauriga-yellowBlueBlackWhite-7"
                }, {
                    "x": 0.63,
                    "y": 0.13,
                    "name": "8",
                    "uid": "meauriga-yellowBlueBlackWhite-8"
                }, {
                    "x": 0.48,
                    "y": 0.13,
                    "name": "9",
                    "uid": "meauriga-yellowBlueBlackWhite-9"
                }, {
                    "x": 0.33,
                    "y": 0.13,
                    "name": "10",
                    "uid": "meauriga-yellowBlueBlackWhite-10"
                }],
                "serial": [{
                    "x": 0.08,
                    "y": 0.585,
                    "name": "serial",
                    "uid": "meauriga-serial"
                }]
            }
        }, {
            "uuid": "meorion",
            "mcu": "uno",
            "vendorIds": ["0x1A86"],
            "productIds": ["0x7523"],
            "manufacturer": "makeblock",
            "underDevelopment": false,
            "order": 9,
            "showInToolbox": false,
            "availableComponents": [
                'mkb_infrared',
                'mkb_lightsensor',
                'mkb_bluetooth',
                'mkb_joystick',
                'mkb_linefollower',
                'mkb_ultrasound',
                'sp'
            ],
            "integratedComponents": [],
            "pinSize": {
                "red": {
                    "w": 50,
                    "h": 50
                },
                "yellow blue white": {
                    "w": 50,
                    "h": 50
                },
                "yellow blue grey": {
                    "w": 50,
                    "h": 50
                },
                "yellow black white": {
                    "w": 50,
                    "h": 50
                },
                "yellow blue black white": {
                    "w": 50,
                    "h": 50
                },
                "serial": {
                    "w": 22,
                    "h": 30
                }
            },
            "pins": {
                "red": [{
                    "x": 0.34,
                    "y": 0.1,
                    "name": "1",
                    "uid": "morion-red-1"
                }, {
                    "x": 0.498,
                    "y": 0.1,
                    "name": "2",
                    "uid": "morion-red-2"
                }],
                "yellow blue white": [{
                    "x": 0.656,
                    "y": 0.1,
                    "name": "3",
                    "uid": "morion-yellowBlueWhite-3"
                }, {
                    "x": 0.81,
                    "y": 0.1,
                    "name": "4",
                    "uid": "morion-yellowBlueWhite-4"
                }],
                "yellow blue grey": [{
                    "x": 0.81,
                    "y": 0.885,
                    "name": "5",
                    "uid": "morion-yellowBlueGrey-5"
                }],
                "yellow blue black white": [{
                    "x": 0.656,
                    "y": 0.885,
                    "name": "6",
                    "uid": "morion-yellowBlueBlackWhite-6"
                }],
                "yellow black white": [{
                    "x": 0.498,
                    "y": 0.885,
                    "name": "7",
                    "uid": "morion-yellowBlackWhite-7"
                }, {
                    "x": 0.34,
                    "y": 0.885,
                    "name": "8",
                    "uid": "morion-yellowBlackWhite-8"
                }],
                "serial": [{
                    "x": 0.1,
                    "y": 0.71,
                    "name": "serial",
                    "uid": "morion-serial"
                }]
            }
        }, {
            "uuid": "ArduinoMEGA2560",
            "mcu": "mega",
            "underDevelopment": false,
            "showInToolbox": true,
            "order": 4,
            "vendorIds": ["0x2341"],
            "productIds": ["0x10", "0x0042", "0x6001", "0x0010"],
            "pinSize": {
                "digital": {
                    "w": 12,
                    "h": 13
                },
                "analog": {
                    "w": 12,
                    "h": 13
                },
                "serial": {
                    "w": 22,
                    "h": 57
                },
                "i2c-4": {
                    "w": 9,
                    "h": 9
                },
                "i2c-5": {
                    "w": 9,
                    "h": 9
                }
            },
            "pins": {
                "digital": [{
                    "x": 0.330,
                    "y": 0.05,
                    "name": "13",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad00"
                }, {
                    "x": 0.3505,
                    "y": 0.05,
                    "name": "12",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad01"
                }, {
                    "x": 0.374,
                    "y": 0.05,
                    "name": "11",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad02"
                }, {
                    "x": 0.396,
                    "y": 0.05,
                    "name": "10",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad03"
                }, {
                    "x": 0.419,
                    "y": 0.05,
                    "name": "9",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad04"
                }, {
                    "x": 0.441,
                    "y": 0.05,
                    "name": "8",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad05"
                }, {
                    "x": 0.4861,
                    "y": 0.05,
                    "name": "7",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad06"
                }, {
                    "x": 0.508,
                    "y": 0.05,
                    "name": "6",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad07"
                }, {
                    "x": 0.531,
                    "y": 0.05,
                    "name": "5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad08"
                }, {
                    "x": 0.553,
                    "y": 0.05,
                    "name": "4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad9"
                }, {
                    "x": 0.576,
                    "y": 0.05,
                    "name": "3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad10"
                }, {
                    "x": 0.598,
                    "y": 0.05,
                    "name": "2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad11"
                }, {
                    "x": 0.62,
                    "y": 0.05,
                    "name": "1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad12"
                }, {
                    "x": 0.643,
                    "y": 0.05,
                    "name": "0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad13"
                }, {
                    "x": 0.6872,
                    "y": 0.05,
                    "name": "14",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad14"
                }, {
                    "x": 0.71,
                    "y": 0.05,
                    "name": "15",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad15"
                }, {
                    "x": 0.732,
                    "y": 0.05,
                    "name": "16",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad16"
                }, {
                    "x": 0.755,
                    "y": 0.05,
                    "name": "17",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad17"
                }, {
                    "x": 0.7762,
                    "y": 0.05,
                    "name": "18",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad18"
                }, {
                    "x": 0.8,
                    "y": 0.05,
                    "name": "19",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad19"
                }, {
                    "x": 0.822,
                    "y": 0.05,
                    "name": "i2c-4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad20"
                }, {
                    "x": 0.8447,
                    "y": 0.05,
                    "name": "i2c-5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad21"
                }, {
                    "x": 0.911,
                    "y": 0.104,
                    "name": "22",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad22"
                }, {
                    "x": 0.933,
                    "y": 0.104,
                    "name": "23",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad23"
                }, {
                    "x": 0.911,
                    "y": 0.15,
                    "name": "24",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad24"
                }, {
                    "x": 0.933,
                    "y": 0.15,
                    "name": "25",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad25"
                }, {
                    "x": 0.911,
                    "y": 0.194,
                    "name": "26",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad26"
                }, {
                    "x": 0.933,
                    "y": 0.194,
                    "name": "27",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad27"
                }, {
                    "x": 0.911,
                    "y": 0.24,
                    "name": "28",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad28"
                }, {
                    "x": 0.933,
                    "y": 0.24,
                    "name": "29",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad29"
                }, {
                    "x": 0.911,
                    "y": 0.29,
                    "name": "30",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad30"
                }, {
                    "x": 0.933,
                    "y": 0.29,
                    "name": "31",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad31"
                }, {
                    "x": 0.911,
                    "y": 0.335,
                    "name": "32",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad32"
                }, {
                    "x": 0.933,
                    "y": 0.335,
                    "name": "33",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad33"
                }, {
                    "x": 0.911,
                    "y": 0.38,
                    "name": "34",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad34"
                }, {
                    "x": 0.933,
                    "y": 0.38,
                    "name": "35",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad35"
                }, {
                    "x": 0.911,
                    "y": 0.43,
                    "name": "36",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad36"
                }, {
                    "x": 0.933,
                    "y": 0.43,
                    "name": "37",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad37"
                }, {
                    "x": 0.911,
                    "y": 0.475,
                    "name": "38",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad38"
                }, {
                    "x": 0.933,
                    "y": 0.475,
                    "name": "39",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad39"
                }, {
                    "x": 0.911,
                    "y": 0.52,
                    "name": "40",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad40"
                }, {
                    "x": 0.933,
                    "y": 0.52,
                    "name": "41",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad41"
                }, {
                    "x": 0.911,
                    "y": 0.565,
                    "name": "42",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad42"
                }, {
                    "x": 0.933,
                    "y": 0.565,
                    "name": "43",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad43"
                }, {
                    "x": 0.911,
                    "y": 0.61,
                    "name": "44",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad44"
                }, {
                    "x": 0.933,
                    "y": 0.61,
                    "name": "45",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad45"
                }, {
                    "x": 0.911,
                    "y": 0.66,
                    "name": "46",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad46"
                }, {
                    "x": 0.933,
                    "y": 0.66,
                    "name": "47",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad47"
                }, {
                    "x": 0.911,
                    "y": 0.705,
                    "name": "48",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad48"
                }, {
                    "x": 0.933,
                    "y": 0.705,
                    "name": "49",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad49"
                }, {
                    "x": 0.911,
                    "y": 0.75,
                    "name": "50",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad50"
                }, {
                    "x": 0.933,
                    "y": 0.75,
                    "name": "51",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad51"
                }, {
                    "x": 0.911,
                    "y": 0.795,
                    "name": "52",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad52"
                }, {
                    "x": 0.933,
                    "y": 0.795,
                    "name": "53",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad53"
                }],
                "analog": [{
                    "x": 0.532,
                    "y": 0.945,
                    "name": "A0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa00"
                }, {
                    "x": 0.555,
                    "y": 0.945,
                    "name": "A1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa01"
                }, {
                    "x": 0.576,
                    "y": 0.945,
                    "name": "A2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa02"
                }, {
                    "x": 0.599,
                    "y": 0.945,
                    "name": "A3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa03"
                }, {
                    "x": 0.62,
                    "y": 0.945,
                    "name": "A4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa04"
                }, {
                    "x": 0.643,
                    "y": 0.945,
                    "name": "A5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa05"
                }, {
                    "x": 0.666,
                    "y": 0.945,
                    "name": "A6",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa06"
                }, {
                    "x": 0.688,
                    "y": 0.945,
                    "name": "A7",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa07"
                }, {
                    "x": 0.732,
                    "y": 0.945,
                    "name": "A8",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa08"
                }, {
                    "x": 0.755,
                    "y": 0.945,
                    "name": "A9",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa09"
                }, {
                    "x": 0.776,
                    "y": 0.945,
                    "name": "A10",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa10"
                }, {
                    "x": 0.8,
                    "y": 0.945,
                    "name": "A11",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa11"
                }, {
                    "x": 0.822,
                    "y": 0.945,
                    "name": "A12",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa12"
                }, {
                    "x": 0.845,
                    "y": 0.945,
                    "name": "A13",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa13"
                }, {
                    "x": 0.866,
                    "y": 0.945,
                    "name": "A14",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa14"
                }, {
                    "x": 0.889,
                    "y": 0.945,
                    "name": "A15",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa15"
                }],
                "serial": [{
                    "x": 0.095,
                    "y": 0.2943,
                    "name": "serial",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edadserial1"
                }],
                "i2c-4": [{
                    "x": 0.822,
                    "y": 0.05,
                    "name": "A4-H",
                    "uid": "6be0rd9d-2e52-4b7d-9dfc-c9edad53a220"
                }],
                "i2c-5": [{
                    "x": 0.8447,
                    "y": 0.05,
                    "name": "A5-H",
                    "uid": "6be0dd9d-2e52-rb7d-9dfc-c9edad53a221"
                }]
            }
        }, {
            "uuid": "ArduinoLeonardo",
            "mcu": "leonardo",
            "underDevelopment": true,
            "showInToolbox": true,
            "order": 5,
            "vendorIds": ["0x2341"],
            "productIds": ['0x0036', '0x8036', '0x800c'],
            "pinSize": {
                "digital": {
                    "w": 9,
                    "h": 15
                },
                "analog": {
                    "w": 9,
                    "h": 15
                },
                "serial": {
                    "w": 33,
                    "h": 66
                },
                "i2c-4": {
                    "w": 9,
                    "h": 9
                },
                "i2c-5": {
                    "w": 9,
                    "h": 9
                }
            },
            "pins": {
                "digital": [{
                    "x": 0.478,
                    "y": 0.098,
                    "name": "13",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad00"
                }, {
                    "x": 0.508,
                    "y": 0.098,
                    "name": "12",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad01"
                }, {
                    "x": 0.545,
                    "y": 0.098,
                    "name": "11",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad02"
                }, {
                    "x": 0.58,
                    "y": 0.098,
                    "name": "10",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad03"
                }, {
                    "x": 0.615,
                    "y": 0.098,
                    "name": "9",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad04"
                }, {
                    "x": 0.649,
                    "y": 0.098,
                    "name": "8",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad05"
                }, {
                    "x": 0.695,
                    "y": 0.098,
                    "name": "7",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad06"
                }, {
                    "x": 0.73,
                    "y": 0.098,
                    "name": "6",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad07"
                }, {
                    "x": 0.765,
                    "y": 0.098,
                    "name": "5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad08"
                }, {
                    "x": 0.795,
                    "y": 0.098,
                    "name": "4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad9"
                }, {
                    "x": 0.832,
                    "y": 0.098,
                    "name": "3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad10"
                }, {
                    "x": 0.869,
                    "y": 0.098,
                    "name": "2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad11"
                }, {
                    "x": 0.9,
                    "y": 0.098,
                    "name": "1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad12"
                }, {
                    "x": 0.935,
                    "y": 0.098,
                    "name": "0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad13"
                }],
                "analog": [{
                    "x": 0.763,
                    "y": 0.92,
                    "name": "A0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa00"
                }, {
                    "x": 0.795,
                    "y": 0.92,
                    "name": "A1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa01"
                }, {
                    "x": 0.83,
                    "y": 0.92,
                    "name": "A2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa02"
                }, {
                    "x": 0.862,
                    "y": 0.92,
                    "name": "A3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa03"
                }, {
                    "x": 0.895,
                    "y": 0.92,
                    "name": "A4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa04"
                }, {
                    "x": 0.935,
                    "y": 0.92,
                    "name": "A5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa05"
                }],
                "serial": [{
                    "x": 0.045,
                    "y": 0.315,
                    "name": "serial",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ac05"
                }],
                "i2c-4": [{
                    "x": 0.903,
                    "y": 0.925,
                    "name": "A4-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53a201"
                }],
                "i2c-5": [{
                    "x": 0.933,
                    "y": 0.925,
                    "name": "A5-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53a200"
                }]
            }
        }, {
            "uuid": "ArduinoNano",
            "mcu": "nano",
            "underDevelopment": true,
            "showInToolbox": true,
            "order": 6,
            "vendorIds": ["0x2341"],
            "productIds": ['0x6001', '0x7523'],
            "pinSize": {
                "digital": {
                    "w": 9,
                    "h": 15
                },
                "analog": {
                    "w": 9,
                    "h": 15
                },
                "serial": {
                    "w": 33,
                    "h": 66
                },
                "i2c-4": {
                    "w": 9,
                    "h": 9
                },
                "i2c-5": {
                    "w": 9,
                    "h": 9
                }
            },
            "pins": {
                "digital": [{
                    "x": 0.478,
                    "y": 0.098,
                    "name": "13",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad00"
                }, {
                    "x": 0.508,
                    "y": 0.098,
                    "name": "12",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad01"
                }, {
                    "x": 0.545,
                    "y": 0.098,
                    "name": "11",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad02"
                }, {
                    "x": 0.58,
                    "y": 0.098,
                    "name": "10",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad03"
                }, {
                    "x": 0.615,
                    "y": 0.098,
                    "name": "9",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad04"
                }, {
                    "x": 0.649,
                    "y": 0.098,
                    "name": "8",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad05"
                }, {
                    "x": 0.695,
                    "y": 0.098,
                    "name": "7",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad06"
                }, {
                    "x": 0.73,
                    "y": 0.098,
                    "name": "6",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad07"
                }, {
                    "x": 0.765,
                    "y": 0.098,
                    "name": "5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad08"
                }, {
                    "x": 0.795,
                    "y": 0.098,
                    "name": "4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad9"
                }, {
                    "x": 0.832,
                    "y": 0.098,
                    "name": "3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad10"
                }, {
                    "x": 0.869,
                    "y": 0.098,
                    "name": "2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad11"
                }, {
                    "x": 0.9,
                    "y": 0.098,
                    "name": "1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad12"
                }, {
                    "x": 0.935,
                    "y": 0.098,
                    "name": "0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ad13"
                }],
                "analog": [{
                    "x": 0.763,
                    "y": 0.92,
                    "name": "A0",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa00"
                }, {
                    "x": 0.795,
                    "y": 0.92,
                    "name": "A1",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa01"
                }, {
                    "x": 0.83,
                    "y": 0.92,
                    "name": "A2",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa02"
                }, {
                    "x": 0.862,
                    "y": 0.92,
                    "name": "A3",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa03"
                }, {
                    "x": 0.895,
                    "y": 0.92,
                    "name": "A4",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa04"
                }, {
                    "x": 0.935,
                    "y": 0.92,
                    "name": "A5",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53aa05"
                }],
                "serial": [{
                    "x": 0.045,
                    "y": 0.315,
                    "name": "serial",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53ac05"
                }],
                "i2c-4": [{
                    "x": 0.903,
                    "y": 0.925,
                    "name": "A4-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53a201"
                }],
                "i2c-5": [{
                    "x": 0.933,
                    "y": 0.925,
                    "name": "A5-H",
                    "uid": "6be0dd9d-2e52-4b7d-9dfc-c9edad53a200"
                }]
            }
        }, function() {
            console.log('finished populating boards');
            next();
        });
    });
}

function createComponents(next) {
    Component.find({}).remove(function() {
        Component.create({
            "uuid": "led",
            "manufacturer": "standard",
            "category": "leds",
            "width": 55,
            "height": 83,
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "RGBled",
            "manufacturer": "standard",
            "category": "rgbs",
            "width": 67,
            "height": 79,
            "pins": {
                "digital": [
                    "b",
                    "g",
                    "r"
                ]
            }
        }, {
            "uuid": "us",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "US",
            "width": 120,
            "height": 79,
            "dataReturnType": "float",
            "pins": {
                "digital": [
                    "trigger",
                    "echo"
                ]
            }
        }, {
            "uuid": "button",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "digital",
            "width": 90,
            "height": 73,
            "dataReturnType": "float",
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "limitswitch",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "digital",
            "width": 100,
            "height": 92,
            "dataReturnType": "float",
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "encoder",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "encoder",
            "width": 74,
            "height": 84,
            "dataReturnType": "float",
            "pin": {
                "sb": "2",
                "sa": "3"
            },
            "pins": {
                "digital": [
                    "k",
                    "sa",
                    "sb"
                ]
            }
        }, {
            "uuid": "sound",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "digital",
            "width": 100,
            "height": 102,
            "dataReturnType": "float",
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "buttons",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "ButtonPad",
            "width": 165,
            "height": 120,
            "dataReturnType": "char",
            "pins": {
                "analog": [
                    "s"
                ]
            }
        }, {
            "uuid": "irs",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "digital",
            "width": 90,
            "height": 77,
            "dataReturnType": "float",
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "irs2",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "LineFollower",
            "width": 97,
            "height": 88,
            "dataReturnType": "float *",
            "pins": {
                "digital": [
                    "s1",
                    "s2"
                ]
            }
        }, {
            "uuid": "joystick",
            "manufacturer": "standard",
            "category": "joystick",
            "type": "Joystick",
            "width": 100,
            "height": 102,
            "dataReturnType": "float *",
            "pins": {
                "analog": [
                    "x",
                    "y"
                ],
                "digital": [
                    "k"
                ]
            }
        }, {
            "uuid": "ldrs",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "analog",
            "width": 90,
            "height": 65,
            "dataReturnType": "float",
            "pins": {
                "analog": [
                    "s"
                ]
            }
        }, {
            "uuid": "pot",
            "manufacturer": "standard",
            "category": "sensors",
            "type": "analog",
            "width": 74,
            "height": 101,
            "dataReturnType": "float",
            "pins": {
                "analog": [
                    "s"
                ]
            }
        }, {
            "uuid": "rtc",
            "manufacturer": "standard",
            "category": "clocks",
            "type": "analog",
            "width": 128,
            "height": 93,
            "pin": {
                "sda": "a4",
                "scl": "a5"
            },
            "pins": {
                "i2c-4": [
                    "sda"
                ],
                "i2c-5": [
                    "scl"
                ]
            }
        }, {
            "uuid": "hts221",
            "manufacturer": "standard",
            "category": "hts221",
            "type": "digital",
            "width": 107,
            "height": 113,
            "pin": {
                "sda": "a4",
                "scl": "a5"
            },
            "pins": {
                "i2c-4": [
                    "sda"
                ],
                "i2c-5": [
                    "scl"
                ]
            }
        }, {
            "uuid": "buzz",
            "manufacturer": "standard",
            "category": "buzzers",
            "type": "digital",
            "width": 85,
            "height": 80,
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "servo",
            "manufacturer": "standard",
            "category": "servos",
            "width": 125,
            "height": 106,
            "pins": {
                "digital": [
                    "s"
                ]
            },
            "oscillator": false
        }, {
            "uuid": "servocont",
            "manufacturer": "standard",
            "category": "continuousServos",
            "width": 125,
            "height": 106,
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "lcd",
            "manufacturer": "standard",
            "category": "lcds",
            "width": 170,
            "height": 93,
            "pin": {
                "sda": "a4",
                "scl": "a5"
            },
            "pins": {
                "i2c-4": [
                    "sda"
                ],
                "i2c-5": [
                    "scl"
                ]
            }
        }, {
            "uuid": "bt",
            "manufacturer": "standard",
            "category": "serialElements",
            "baudRate": 9600,
            "width": 115,
            "height": 88,
            "pins": {
                "digital": [
                    "rx",
                    "tx"
                ]
            }
        }, {
            "uuid": "sp",
            "manufacturer": "standard",
            "category": "serialElements",
            "baudRate": 9600,
            "width": 115,
            "height": 71,
            "pin": {
                "s": "serial"
            },
            "pins": {
                "serial": [
                    "s"
                ]
            }
        }, {
            "uuid": "device",
            "manufacturer": "standard",
            "category": "serialElements",
            "baudRate": 19200,
            "dragType": "btComponent",
            "width": 74,
            "height": 102,
            "pins": {}
        }, {
            "uuid": "mkb_bluetooth",
            "category": "serialElements",
            "manufacturer": "makeblock",
            "baudRate": 115200,
            "width": 115,
            "height": 82.63,
            "pin": {
                "s": "serial"
            },
            "pins": {
                "serial": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_display7seg",
            "category": "display7seg",
            "manufacturer": "makeblock",
            "width": 84.5,
            "height": 128,
            "dataReturnType": "float",
            "pins": {
                "blue": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_joystick",
            "category": "joystick",
            "type": "Joystick",
            "manufacturer": "makeblock",
            "width": 84.5,
            "height": 118.09,
            "dataReturnType": "float",
            "pins": {
                "black": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_lightsensor",
            "category": "mkb_lightsensor",
            "type": "analog",
            "manufacturer": "makeblock",
            "width": 84.5,
            "height": 128,
            "dataReturnType": "float",
            "pins": {
                "black": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_linefollower",
            "category": "mkb_linefollower",
            "manufacturer": "makeblock",
            "type": "mkb_linefollower",
            "width": 84.5,
            "height": 128,
            "dataReturnType": "float",
            "pins": {
                "blue": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_soundsensor",
            "category": "mkb_soundsensor",
            "type": "analog",
            "manufacturer": "makeblock",
            "width": 84.5,
            "height": 155.22,
            "dataReturnType": "float",
            "pins": {
                "black": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_pot",
            "category": "sensors",
            "type": "analog",
            "manufacturer": "makeblock",
            "width": 84.5,
            "height": 118.09,
            "dataReturnType": "float",
            "pins": {
                "black": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_remote",
            "category": "remoteControl",
            "type": "remote",
            "manufacturer": "makeblock",
            "dataReturnType": "char",
            "width": 74,
            "height": 124.38,
            "wirelessConnection": true,
            "pins": {}
        }, {
            "uuid": "mkb_4buttonKeyPad",
            "category": "mkb_4buttonKeyPad",
            "type": "ButtonPad",
            "manufacturer": "makeblock",
            "width": 84.5,
            "height": 155.05,
            "dataReturnType": "int",
            "pins": {
                "black": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_ultrasound",
            "category": "mkb_ultrasound",
            "manufacturer": "makeblock",
            "width": 134.5,
            "height": 106.2,
            "dataReturnType": "float",
            "pins": {
                "yellow": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_integrated_analogPinButton",
            "manufacturer": "makeblock",
            "category": "sensors",
            "type": "mkb_integrated_analogPinButton",
            "width": 0,
            "height": 0,
            "dataReturnType": "float",
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_integrated_lightsensor",
            "manufacturer": "makeblock",
            "category": "mkb_lightsensor",
            "type": "mkb_integrated_lightsensor",
            "width": 0,
            "height": 0,
            "dataReturnType": "float",
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_integrated_buzz",
            "manufacturer": "makeblock",
            "category": "mkb_integrated_buzz",
            "width": 0,
            "height": 0,
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, {
            "uuid": "mkb_integrated_RGB",
            "manufacturer": "makeblock",
            "category": "mkb_integrated_RGB",
            "type": "mkb_integrated",
            "width": 0,
            "height": 0,
            "pins": {
                "digital": [
                    "s"
                ]
            }
        }, function() {
            console.log('finished populating components');
            next();
        });
    });
}

function createKits(boards, components, next) {
    Kit.find({}).remove(function() {
        Kit.create({
            "uuid": "kitgeneric",
            "purchaseUrl": "http://www.elecfreaks.com/estore/arduino-advanced-kit.html",
            "boards": [boards['bqZUM'][0]._id, boards['FreaduinoUNO'][0]._id, boards['ArduinoUNO'][0]._id],
            "components": [components['led'][0]._id, components['encoder'][0]._id, components['joystick'][0]._id,
                components['button'][0]._id, components['RGBled'][0]._id, components['irs'][0]._id,
                components['sound'][0]._id, components['rtc'][0]._id, components['limitswitch'][0]._id,
                components['ldrs'][0]._id, components['irs2'][0]._id, components['lcd'][0]._id,
                components['us'][0]._id, components['buttons'][0]._id, components['pot'][0]._id,
                components['servo'][0]._id, components['servocont'][0]._id, components['device'][0]._id,
                components['buzz'][0]._id, components['sp'][0]._id, components['hts221'][0]._id,
                components['bt'][0]._id
            ]
        }, {
            "uuid": "bqzumbox",
            "purchaseUrl": "https://www.bq.com/es/zum-kit",
            "manufacturer": "bq",
            "boards": [boards['bqZUM'][0]._id],
            "components": [components['irs'][0]._id, components['button'][0]._id, components['ldrs'][0]._id,
                components['buzz'][0]._id, components['us'][0]._id, components['pot'][0]._id,
                components['led'][0]._id, components['servo'][0]._id, components['servocont'][0]._id
            ]
        }, {
            "uuid": "elecfreakstarterkit",
            "purchaseUrl": "http://www.elecfreaks.com/estore/arduino-starter-kit-absolute-beginner.html",
            "manufacturer": "elecfreaks",
            "boards": [boards['FreaduinoUNO'][0]._id],
            "components": [components['led'][0]._id, components['button'][0]._id, components['ldrs'][0]._id,
                components['buzz'][0]._id, components['encoder'][0]._id, components['servo'][0]._id,
                components['hts221'][0]._id
            ]
        }, {
            "uuid": "elecfreakadvancedKit",
            "purchaseUrl": "http://www.elecfreaks.com/estore/arduino-advanced-kit.html",
            "manufacturer": "elecfreaks",
            "boards": [boards['FreaduinoUNO'][0]._id],
            "components": [components['lcd'][0]._id, components['buttons'][0]._id, components['buzz'][0]._id]
        }, function() {
            console.log('finished populating kits');
            next();
        });
    });
}

function createRobots(components, next) {
    Robot.find({}).remove(function() {
        Robot.create({
            "uuid": "zowi",
            "board": "ArduinoUNO",
            "order": 1,
            "width": 75,
            "height": 86
        }, {
            "uuid": "evolution",
            "board": "bqZUM",
            "order": 2,
            "width": 75,
            "height": 86
        }, {
            "uuid": "mbot",
            "board": "mcore",
            "order": 3,
            "family": "mBot",
            "thirdParty": true,
            "manufacturer": "makeblock",
            "useBoardImage": true,
            "includedComponents": [
                components['sp'][0]._id,
                components['mkb_ultrasound'][0]._id,
                components['mkb_linefollower'][0]._id,
                components['mkb_lightsensor'][0]._id,
                components['mkb_joystick'][0]._id,
                components['mkb_soundsensor'][0]._id,
                components['mkb_4buttonKeyPad'][0]._id,
                components['mkb_display7seg'][0]._id,
                components['mkb_remote'][0]._id
            ],
            "width": 75,
            "height": 86
        }, {
            "uuid": "rangerlandraider",
            "board": "meauriga",
            "order": 4,
            "family": "mRanger",
            "thirdParty": true,
            "useBoardImage": true,
            "includedComponents": [
                components['sp'][0]._id,
                components['mkb_ultrasound'][0]._id,
                components['mkb_linefollower'][0]._id,
                components['mkb_lightsensor'][0]._id,
                components['mkb_joystick'][0]._id,
                components['mkb_soundsensor'][0]._id,
                components['mkb_4buttonKeyPad'][0]._id,
                components['mkb_display7seg'][0]._id,
                components['mkb_remote'][0]._id
            ],
            "width": 75,
            "height": 86
        }, {
            "uuid": "rangerraptor",
            "board": "meauriga",
            "order": 5,
            "family": "mRanger",
            "thirdParty": true,
            "useBoardImage": true,
            "includedComponents": [
                components['sp'][0]._id,
                components['mkb_ultrasound'][0]._id,
                components['mkb_linefollower'][0]._id,
                components['mkb_lightsensor'][0]._id,
                components['mkb_joystick'][0]._id,
                components['mkb_soundsensor'][0]._id,
                components['mkb_4buttonKeyPad'][0]._id,
                components['mkb_display7seg'][0]._id,
                components['mkb_remote'][0]._id
            ],
            "width": 75,
            "height": 86
        }, {
            "uuid": "rangernervousbird",
            "board": "meauriga",
            "order": 6,
            "family": "mRanger",
            "thirdParty": true,
            "useBoardImage": true,
            "includedComponents": [
                components['sp'][0]._id,
                components['mkb_ultrasound'][0]._id,
                components['mkb_linefollower'][0]._id,
                components['mkb_lightsensor'][0]._id,
                components['mkb_joystick'][0]._id,
                components['mkb_soundsensor'][0]._id,
                components['mkb_display7seg'][0]._id,
                components['mkb_remote'][0]._id
            ],
            "width": 75,
            "height": 86
        }, {
            "uuid": "startertank",
            "board": "meorion",
            "order": 7,
            "family": "starterKit",
            "thirdParty": true,
            "useBoardImage": true,
            "includedComponents": [
                components['sp'][0]._id,
                components['mkb_ultrasound'][0]._id,
                components['mkb_joystick'][0]._id,
                components['mkb_soundsensor'][0]._id,
                components['mkb_display7seg'][0]._id,
                components['mkb_remote'][0]._id
            ],
            "width": 75,
            "height": 86
        }, {
            "uuid": "starterthreewheels",
            "family": "starterKit",
            "order": 8,
            "thirdParty": true,
            "board": "meorion",
            "useBoardImage": true,
            "includedComponents": [
                components['sp'][0]._id,
                components['mkb_ultrasound'][0]._id,
                components['mkb_joystick'][0]._id,
                components['mkb_soundsensor'][0]._id,
                components['mkb_display7seg'][0]._id,
                components['mkb_remote'][0]._id
            ],
            "width": 75,
            "height": 86
        }, {
            "uuid": "freakscar",
            "board": "ArduinoUNO",
            "order": 9,
            "width": 75,
            "height": 86
        }, function() {
            console.log('finished populating robots');
            next();
        });
    });
}

exports.createAllHardware = function(next) {
    async.parallel([
        createBoards,
        createComponents
    ], function() {
        Board.find({
            "uuid": {
                $in: ["bqZUM", "FreaduinoUNO", "ArduinoUNO"]
            }
        }).exec(function(err, boards) {
            Component.find({}).exec(function(err, components) {
                var boardByUuid = _.groupBy(boards, 'uuid'),
                    componentsByUuid = _.groupBy(components, 'uuid');
                async.parallel([
                    createKits.bind(this, boardByUuid, componentsByUuid),
                    createRobots.bind(this, componentsByUuid)
                ], next);
            });
        });
    });
};

/************************
 ******* NEW ************
 ************************/

exports.createComponents = function(components, next) {

};
