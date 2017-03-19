/**
 * @fileoverview TI Innovator IO blocks for Blockly
 */
'use strict';

goog.provide('Blockly.Blocks.innovator_io');

goog.require('Blockly.Blocks');

Blockly.Blocks.innovator_io.SENSORS = [
    [
        "LED",
        "LED"
    ],
    [
        "LIGHTLEVEL",
        "LIGHTLEVEL"
    ]
];

Blockly.Blocks.innovator_io.PORTS = [
    [
        "OUT 1",
        "OUT1"
    ],
    [
        "OUT 2",
        "OUT2"
    ],
    [
        "OUT 3",
        "OUT3"
    ],
    [
        "IN 1",
        "IN1"
    ],
    [
        "IN 2",
        "IN2"
    ],
    [
        "IN 3",
        "IN3"
    ],
    [
        "I2C",
        "I2C"
    ],
    [
        "BB 1",
        "BB1"
    ],
    [
        "BB 2",
        "BB2"
    ],
    [
        "BB 3",
        "BB3"
    ],
    [
        "BB 4",
        "BB4"
    ],
    [
        "BB 5",
        "BB5"
    ],
    [
        "BB 6",
        "BB6"
    ],
    [
        "BB 7",
        "BB7"
    ],
    [
        "BB 8",
        "BB8"
    ],
    [
        "BB 9",
        "BB9"
    ],
    [
        "BB 10",
        "BB10"
    ]
];

Blockly.Blocks['innovator_io_light_ext'] = {
    init: function () {
        this.jsonInit({
          "type": "innovator_io_light_ext",
          "message0": "turn LIGHT %1 for %2 seconds",
          "args0": [
            {
              "type": "field_dropdown",
              "name": "STATE",
              "options": [
                [
                  "On",
                  "ON"
                ],
                [
                  "Off",
                  "OFF"
                ]
              ]
            },
            {
              "type": "input_value",
              "name": "TIME",
              "check": "Number"
            }
          ],
          "inputsInline": true,
          "previousStatement": null,
          "nextStatement": null,
          "colour": 58,
          "tooltip": "",
          "helpUrl": ""
        });
    }
};

Blockly.Blocks['innovator_io_light'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_light",
            "message0": "turn LIGHT %1",
            "args0": [
            {
              "type": "field_dropdown",
              "name": "STATE",
              "options": [
                [
                  "On",
                  "ON"
                ],
                [
                  "Off",
                  "OFF"
                ]
              ]
            }
            ],
            "colour": 58,
            "tooltip": "",
            "helpUrl": "",
            "previousStatement": null,
            "nextStatement": null
        });
    }
};

Blockly.Blocks['innovator_io_wait'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_wait",
            "message0": "wait for %1 seconds",
            "args0": [
                {
                    "type": "input_value",
                    "name": "TIME",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 58,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.Blocks['innovator_io_sound_ext'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_sound_ext",
            "message0": "play SOUND at %1 Hz for %2 seconds",
            "args0": [
                {
                    "type": "input_value",
                    "name": "FREQUENCY",
                    "check": "Number"
                },
                {
                    "type": "input_value",
                    "name": "TIME",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 58,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.Blocks['innovator_io_sound'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_sound_ext",
            "message0": "play SOUND at %1 Hz",
            "args0": [
                {
                    "type": "input_value",
                    "name": "FREQUENCY",
                    "check": "Number"
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 58,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.Blocks['innovator_io_read'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_read",
            "message0": "read %1 into %2",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "DATA",
                    "options": [
                        [
                            "BRIGHTNESS",
                            "BRIGHTNESS"
                        ],
                        [
                            "LIGHTLEVEL 1",
                            "LIGHTLEVEL 1"
                        ]
                    ]
                },
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "variable": "var"
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 58,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.Blocks['innovator_io_connect'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_connect",
            "message0": "connect %1 %2 to port %3",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SENSOR",
                    "options": Blockly.Blocks.innovator_io.SENSORS
                },
                {
                  "type": "field_number",
                  "name": "INDEX",
                  "value": 1,
                  "min": 1,
                  "max": 100,
                  "precision": 1
                },
                {
                    "type": "field_dropdown",
                    "name": "PORT",
                    "options": Blockly.Blocks.innovator_io.PORTS
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 58,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.Blocks['innovator_io_disconnect'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_disconnect",
            "message0": "disconnect %1 %2",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SENSOR",
                    "options": Blockly.Blocks.innovator_io.SENSORS
                },
                {
                  "type": "field_number",
                  "name": "INDEX",
                  "value": 1,
                  "min": 1,
                  "max": 100,
                  "precision": 1
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 58,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};

Blockly.Blocks['innovator_io_led'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_led",
            "message0": "Set LED %1 to %2",
            "args0": [
                {
                    "type": "field_number",
                    "name": "INDEX",
                    "value": 1,
                    "min": 1,
                    "max": 100,
                    "precision": 1
                },
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Number"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": 58,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};


Blockly.Blocks['innovator_io_color'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_color",
            "message0": "Set COLOR to %1 Red %2 Green %3 Blue %4",
            "args0": [
                {
                    "type": "input_dummy"
                },
                {
                    "type": "input_value",
                    "name": "RED",
                    "check": "Number",
                    "align": "RIGHT"
                },
                {
                    "type": "input_value",
                    "name": "GREEN",
                    "check": "Number",
                    "align": "RIGHT"
                },
                {
                    "type": "input_value",
                    "name": "BLUE",
                    "check": "Number",
                    "align": "RIGHT"
                }
            ],
            "inputsInline": false,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 58,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};
