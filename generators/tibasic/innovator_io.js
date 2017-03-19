
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
    var code = 'Send("SET LIGHT ' + state + ' TIME ' + time + '"):';
    return code;
};

Blockly.TIBasic['innovator_io_led'] = function(block) {
  var state = block.getFieldValue('STATE');
  var code = 'Send("SET LIGHT ' + state + '"):';
  return code;
};