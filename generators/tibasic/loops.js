/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating JavaScript for loop blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.TIBasic.loops');

goog.require('Blockly.TIBasic');


Blockly.TIBasic['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.TIBasic.valueToCode(block, 'TIMES',
        Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.TIBasic.statementToCode(block, 'DO');
  branch = Blockly.TIBasic.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.TIBasic.variableDB_.getDistinctName(
      'loops', Blockly.Variables.NAME_TYPE);
  code += 'Local ' + loopVar;
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.TIBasic.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += ',' + endVar + ":";
    code += '' + endVar + ':=' + repeats + ':';
  } else {
    code += ':';
  }
  code += 'For ' + loopVar + ',1,' + endVar + ':' + branch + 'EndFor:';
  return code;
};

Blockly.TIBasic['controls_repeat'] =
    Blockly.TIBasic['controls_repeat_ext'];

Blockly.TIBasic['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.TIBasic.valueToCode(block, 'BOOL',
      until ? Blockly.TIBasic.ORDER_LOGICAL_NOT :
      Blockly.TIBasic.ORDER_NONE) || 'false';
  var branch = Blockly.TIBasic.statementToCode(block, 'DO');
  branch = Blockly.TIBasic.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = 'not ' + argument0;
  }
  return 'While ' + argument0 + ':' + branch + 'EndWhile:';
};

Blockly.TIBasic['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.TIBasic.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.TIBasic.valueToCode(block, 'FROM',
      Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.TIBasic.valueToCode(block, 'TO',
      Blockly.TIBasic.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.TIBasic.valueToCode(block, 'BY',
      Blockly.TIBasic.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.TIBasic.statementToCode(block, 'DO');
  branch = Blockly.TIBasic.addLoopTrap(branch, block.id);
  var code;
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All arguments are simple numbers.
    var up = parseFloat(argument0) <= parseFloat(argument1);
    code = 'For ' + variable0 + ',' + argument0 + ',' + argument1;
    var step = Math.abs(parseFloat(increment));
    if (!up) {
      step = -step;
    }
    if (step != 1) {
      code += ',' + step;
    }
    code += ':' + branch + 'EndFor:';
  } else {
    // Determine loop direction at start, in case one of the bounds
    // changes during loop execution.
    var incVar = Blockly.TIBasic.variableDB_.getDistinctName(
        variable0 + '_inc', Blockly.Variables.NAME_TYPE);
    // Cache non-trivial values to variables to prevent repeated look-ups.
    var startVar = Blockly.TIBasic.variableDB_.getDistinctName(
        variable0 + '_start', Blockly.Variables.NAME_TYPE);
    var endVar = Blockly.TIBasic.variableDB_.getDistinctName(
        variable0 + '_end', Blockly.Variables.NAME_TYPE);
    var tmpVar = Blockly.TIBasic.variableDB_.getDistinctName(
          'swap', Blockly.Variables.NAME_TYPE);

    code = 'Local ' + incVar + ',' + startVar + ',' + endVar + ':';
    code += incVar + ' := ';
    if (Blockly.isNumber(increment)) {
      code += Math.abs(increment) + ':';
    } else {
      code += 'abs(' + increment + '):';
    }
    code += startVar + ' := ' + argument0 + ':';
    code += endVar + ' := ' + argument1 + ':';
    code += 'If ' + startVar + ' > ' + endVar + ' Then:';
    code += incVar + ' := -' + incVar + ':';
    code += 'EndIf:';
    code += 'For ' + variable0 + ',' + startVar + ',' + endVar + ',' + incVar + ':' +
        branch + 'EndFor:';
  }
  return code;
};

Blockly.TIBasic['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.TIBasic.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.TIBasic.valueToCode(block, 'LIST',
      Blockly.TIBasic.ORDER_ASSIGNMENT) || '[]';
  var branch = Blockly.TIBasic.statementToCode(block, 'DO');
  branch = Blockly.TIBasic.addLoopTrap(branch, block.id);
  var code = '';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  var listVar = argument0;
  if (!argument0.match(/^\w+$/)) {
    listVar = Blockly.TIBasic.variableDB_.getDistinctName(
        variable0 + '_list', Blockly.Variables.NAME_TYPE);
    code += 'var ' + listVar + ' = ' + argument0 + ';\n';
  }
  var indexVar = Blockly.TIBasic.variableDB_.getDistinctName(
      variable0 + '_index', Blockly.Variables.NAME_TYPE);
  branch = Blockly.TIBasic.INDENT + variable0 + ' = ' +
      listVar + '[' + indexVar + '];\n' + branch;
  code += 'for (var ' + indexVar + ' in ' + listVar + ') {\n' + branch + '}\n';
  return code;
};

Blockly.TIBasic['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'Exit:';
    case 'CONTINUE':
      return 'Cycle:';
  }
  throw 'Unknown flow statement.';
};
