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
          "message0": "Turn the RED Led %1 for %2 seconds",
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
            "message0": "Turn the RED Led %1",
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