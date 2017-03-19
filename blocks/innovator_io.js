/**
 * @fileoverview TI Innovator IO blocks for Blockly
 */
'use strict';

goog.provide('Blockly.Blocks.innovator_io');

goog.require('Blockly.Blocks');

Blockly.Blocks['innovator_io_led_ext'] = {
    init: function () {
        this.jsonInit({
          "type": "innovator_io_led_ext",
          "message0": "Turn LIGHT %1 for %2 seconds",
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

Blockly.Blocks['innovator_io_led'] = {
    init: function () {
        this.jsonInit({
            "type": "innovator_io_led",
            "message0": "Turn LIGHT %1",
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
            "message0": "Wait for %1 seconds",
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
            "message0": "Play SOUND at %1 Hz for %2 seconds",
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
            "message0": "Play SOUND at %1 Hz",
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