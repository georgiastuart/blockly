
/**
 * @fileoverview Generating TI Basic for TI Innovator IO blocks
 */
'use strict';

goog.provide('Blockly.TIBasic.innovator_io');

goog.require('Blockly.TIBasic');

Blockly.TIBasic['innovator_io_light_ext'] = function(block) {
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

Blockly.TIBasic['innovator_io_light'] = Blockly.TIBasic['innovator_io_light_ext'];

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

Blockly.TIBasic['innovator_io_read'] = function(block) {
    var data = block.getFieldValue('DATA');
    var variable = Blockly.TIBasic.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var code = 'Send("READ ' + data + '"):';
    code += 'Get(' + variable + '):';
    return code;
};

Blockly.TIBasic['innovator_io_connect'] = function(block) {
    var sensor = block.getFieldValue('SENSOR');
    var index = String(Number(block.getFieldValue('INDEX')));
    var port = block.getFieldValue('PORT');
    var code = 'Send("CONNECT ' + sensor + ' ' + index + ' ' + port + '"):';
    return code;
};

Blockly.TIBasic['innovator_io_disconnect'] = function(block) {
    var sensor = block.getFieldValue('SENSOR');
    var index = String(Number(block.getFieldValue('INDEX')));
    var code = 'Send("DISCONNECT ' + sensor + ' ' + index + '"):';
    return code;
};

Blockly.TIBasic['innovator_io_led'] = function(block) {
    var index = String(Number(block.getFieldValue('INDEX')));
    if (block.getField('TIME')) {
        // Internal number.
        var value = String(Number(block.getFieldValue('VALUE')));
    } else {
        // External number.
        var value = Blockly.TIBasic.valueToCode(block, 'VALUE',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
        if (!Blockly.isNumber(value)) {
            value = 'eval(' + String(value) + ')'
        }
    }
    var code = 'Send("SET LED ' + index + ' ' + value + '"):';
    return code;
};

Blockly.TIBasic['innovator_io_color'] = function(block) {
    if (block.getField('RED')) {
        // Internal number.
        var red = String(Number(block.getFieldValue('RED')));
    } else {
        // External number.
        var red = Blockly.TIBasic.valueToCode(block, 'RED',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
        if (!Blockly.isNumber(red)) {
            red = 'eval(' + String(red) + ')'
        }
    }
    if (block.getField('GREEN')) {
        // Internal number.
        var green = String(Number(block.getFieldValue('GREEN')));
    } else {
        // External number.
        var green = Blockly.TIBasic.valueToCode(block, 'GREEN',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
        if (!Blockly.isNumber(green)) {
            green = 'eval(' + String(green) + ')'
        }
    }
    if (block.getField('BLUE')) {
        // Internal number.
        var blue = String(Number(block.getFieldValue('BLUE')));
    } else {
        // External number.
        var blue = Blockly.TIBasic.valueToCode(block, 'BLUE',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
        if (!Blockly.isNumber(blue)) {
            blue = 'eval(' + String(blue) + ')'
        }
    }
    var code = 'Send("SET COLOR ' + red + ' ' + green + ' ' + blue + '"):';
    return code;
};
