
/**
 * @fileoverview Generating TI Basic for TI Innovator IO blocks
 */
'use strict';

goog.provide('Blockly.TIBasic.innovator_io');

goog.require('Blockly.TIBasic');

Blockly.TIBasic['innovator_io_led_ext'] = function(block) {
    var state = block.getFieldValue('STATE');
    if (block.getField('TIME')) {
        // Internal number.
        var time = String(Number(block.getFieldValue('TIME')));
    } else {
        // External number.
        var time = Blockly.TIBasic.valueToCode(block, 'TIME',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
        if (!Blockly.isNumber(time)) {
            time = 'eval(' + String(time) + ')'
        }
    }
    var code = 'Send("SET LIGHT ' + state;
    if (time !== '0') {
        code += ' TIME ' + time;
    }
    return code + '"):';
};

Blockly.TIBasic['innovator_io_led'] = Blockly.TIBasic['innovator_io_led_ext'];

Blockly.TIBasic['innovator_io_wait'] = function(block) {
    if (block.getField('TIME')) {
        // Internal number.
        var time = String(Number(block.getFieldValue('TIME')));
    } else {
        // External number.
        var time = Blockly.TIBasic.valueToCode(block, 'TIME',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
    }
    var code = 'Wait ' + time + ':';
    return code;
};

Blockly.TIBasic['innovator_io_sound_ext'] = function(block) {
    if (block.getField('FREQUENCY')) {
        // Internal number.
        var freq = String(Number(block.getFieldValue('FREQUENCY')));
    } else {
        // External number.
        var freq = Blockly.TIBasic.valueToCode(block, 'FREQUENCY',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
        if (!Blockly.isNumber(freq)) {
            freq = 'eval(' + String(freq) + ')'
        }
    }
    if (block.getField('TIME')) {
        // Internal number.
        var time = String(Number(block.getFieldValue('TIME')));
    } else {
        // External number.
        var time = Blockly.TIBasic.valueToCode(block, 'TIME',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
        if (!Blockly.isNumber(time)) {
            time = 'eval(' + String(time) + ')'
        }
    }
    var code = 'Send("SET SOUND ' + freq;
    if (time !== '0') {
        code += ' TIME ' + time;
    }
    return code + '"):';
};

Blockly.TIBasic['innovator_io_sound'] = Blockly.TIBasic['innovator_io_sound_ext'];