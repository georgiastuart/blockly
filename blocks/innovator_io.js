/**
 * @fileoverview TI Innovator IO blocks for Blockly
 */
'use strict';

goog.provide('Blockly.Blocks.innovator_io');

goog.require('Blockly.Blocks');

Blockly.Blocks['innovator_io_led'] = {
    /**
     * Block for print statement.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "type": "innovator_io_led",
            "message0": "Turn the RED Led %1",
            "args0": [
            {
              "type": "field_dropdown",
              "name": "NAME",
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
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        });
    }
};