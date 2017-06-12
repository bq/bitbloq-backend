'use strict';

var HardwareFunctions = require('./hardware.functions.js'),
    HardwareDefault = require('./hardware.default.js');

/**
 * Add hardware
 * type: all -> Create all hardware
 * components: [Array] -> Create component Array
 **   example:
 ** {
    "components": [{
            "data": {
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
            },
            "included": {
                    "boards": {
                    	"integrated":{
                    		"FreaduinoUNO": {
                                "id": "led",
                                "name": "default-var-name-mkb_integrated_led",
                                "uid": "integrated-led"
                            }
                    	},
						"compatible":["ArduinoUNO", "bqZUM"]
                    },
                     "robots": ["zowi", "evolution"],
                     "kits": ["bqzumbox"]
            }
        }]
}
 **
 */
exports.insertHardware = function(req, res) {
    if (req.body.components) {
        HardwareFunctions.createComponents(req.body.components, function(err) {
            if (err) {
                console.log(err);
                err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                res.sendStatus(200);
            }
        });
    } else if (req.body.type === 'all') {
        HardwareDefault.createAllHardware(function(err) {
            if (err) {
                console.log(err);
                err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
                res.status(err.code).send(err);
            } else {
                res.sendStatus(200);
            }
        });
    }
};

/**
 * Get all hardware
 */
exports.getAllHardware = function(req, res) {
    HardwareFunctions.getAllHardware(function(err, result) {
        if (err) {
            console.log(err);
            err.code = (err.code && String(err.code).match(/[1-5][0-5][0-9]/g)) ? parseInt(err.code) : 500;
            res.status(err.code).send(err);
        } else {
            res.status(200).json(result);
        }
    });
};
