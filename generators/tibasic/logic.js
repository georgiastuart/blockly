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
 * @fileoverview Generating JavaScript for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.TIBasic.logic');

goog.require('Blockly.TIBasic');


Blockly.TIBasic['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.TIBasic.valueToCode(block, 'IF' + n,
      Blockly.TIBasic.ORDER_NONE) || 'false';
    branchCode = Blockly.TIBasic.statementToCode(block, 'DO' + n);
    code += (n > 0 ? 'ElseIf ' : 'If ') +
        conditionCode + ' Then:' + branchCode;

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.TIBasic.statementToCode(block, 'ELSE');
    code += 'Else:' + branchCode;
  }
  return code + "EndIf:";
};

Blockly.TIBasic['controls_ifelse'] = Blockly.TIBasic['controls_if'];

Blockly.TIBasic['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '=',
    'NEQ': '/=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = Blockly.TIBasic.ORDER_RELATIONAL;
  var argument0 = Blockly.TIBasic.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.TIBasic.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.TIBasic['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == 'and') ? Blockly.TIBasic.ORDER_LOGICAL_AND :
      Blockly.TIBasic.ORDER_LOGICAL_OR;
  var argument0 = Blockly.TIBasic.valueToCode(block, 'A', order);
  var argument1 = Blockly.TIBasic.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == 'and') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.TIBasic['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.TIBasic.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.TIBasic.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = 'not(' + argument0 + ")";
  return [code, order];
};

Blockly.TIBasic['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.TIBasic.ORDER_ATOMIC];
};

Blockly.TIBasic['logic_null'] = function(block) {
  // Null data type.
  return ['undef', Blockly.TIBasic.ORDER_ATOMIC];
};

Blockly.TIBasic['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.TIBasic.valueToCode(block, 'IF',
      Blockly.TIBasic.ORDER_FUNCTION_CALL) || 'false';
  var value_then = Blockly.TIBasic.valueToCode(block, 'THEN',
      Blockly.TIBasic.ORDER_FUNCTION_CALL) || 'undef';
  var value_else = Blockly.TIBasic.valueToCode(block, 'ELSE',
      Blockly.TIBasic.ORDER_FUNCTION_CALL) || 'undef';
  var code = "ifFn(" + value_if + ',' + value_then + ',' + value_else + ")";
  return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
};
