
/**
 * @fileoverview Generating TI Basic for TI Innovator IO blocks
 */
'use strict';

goog.provide('Blockly.TIBasic.innovator_io');

goog.require('Blockly.TIBasic');

Blockly.JavaScript['innovator_io_led'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};