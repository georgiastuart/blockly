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
 * @fileoverview Generating JavaScript for text blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.TIBasic.texts');

goog.require('Blockly.TIBasic');

var isString = function (block, addr) {
    return  'string(' + value + ')';
};

Blockly.TIBasic['text'] = function (block) {
    // Text value.
    var code = Blockly.TIBasic.quote_(block.getFieldValue('TEXT'));
    return [code, Blockly.TIBasic.ORDER_ATOMIC];
};

Blockly.TIBasic['text_join'] = function (block) {
    // Create a string made up of any number of elements of any type.
    switch (block.itemCount_) {
        case 0:
            return ['\"\"', Blockly.TIBasic.ORDER_ATOMIC];
        case 1:
            var element = Blockly.TIBasic.valueToCode(block, 'ADD0',
                    Blockly.TIBasic.ORDER_NONE) || '\"\"';
            var code = 'string(' + element + ')';
            return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
        case 2:
            var element0 = Blockly.TIBasic.valueToCode(block, 'ADD0',
                    Blockly.TIBasic.ORDER_NONE) || '\"\"';
            var element1 = Blockly.TIBasic.valueToCode(block, 'ADD1',
                    Blockly.TIBasic.ORDER_NONE) || '\"\"';
            var code = 'string(' + element0 + ') & string(' + element1 + ')';
            return [code, Blockly.TIBasic.ORDER_ADDITIVE];
        default:
            var elements = new Array(block.itemCount_);
            for (var i = 0; i < block.itemCount_; i++) {
                elements[i] = 'string(' + Blockly.TIBasic.valueToCode(block, 'ADD' + i, Blockly.TIBasic.ORDER_NONE) + ')' || '\"\"';
            }
            var code = elements.join(' & ');
            return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
    }
};

Blockly.TIBasic['text_append'] = function (block) {
    // Append to a variable in place.
    var varName = Blockly.TIBasic.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var value = Blockly.TIBasic.valueToCode(block, 'TEXT',
            Blockly.TIBasic.ORDER_NONE) || '\'\'';
    return varName + ' := string(' + varName + ') & string(' + value + '):';
};

Blockly.TIBasic['text_length'] = function (block) {
    // String or array length.
    var text = Blockly.TIBasic.valueToCode(block, 'VALUE',
            Blockly.TIBasic.ORDER_FUNCTION_CALL) || '\'\'';
    return ['dim(' + text + ')', Blockly.TIBasic.ORDER_ATOMIC];
};

Blockly.TIBasic['text_isEmpty'] = function (block) {
    // Is the string null or array empty?
    var text = Blockly.TIBasic.valueToCode(block, 'VALUE',
            Blockly.TIBasic.ORDER_MEMBER) || '\'\'';
    return ['!' + text + '.length', Blockly.TIBasic.ORDER_LOGICAL_NOT];
};

Blockly.TIBasic['text_indexOf'] = function (block) {
    // Search the text for a substring.
    var operator = block.getFieldValue('END') == 'FIRST' ?
        'indexOf' : 'lastIndexOf';
    var substring = Blockly.TIBasic.valueToCode(block, 'FIND',
            Blockly.TIBasic.ORDER_NONE) || '\'\'';
    var text = Blockly.TIBasic.valueToCode(block, 'VALUE',
            Blockly.TIBasic.ORDER_MEMBER) || '\'\'';
    var code = text + '.' + operator + '(' + substring + ')';
    // Adjust index if using one-based indices.
    if (block.workspace.options.oneBasedIndex) {
        return [code + ' + 1', Blockly.TIBasic.ORDER_ADDITION];
    }
    return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
};

Blockly.TIBasic['text_charAt'] = function (block) {
    // Get letter at index.
    // Note: Until January 2013 this block did not have the WHERE input.
    var where = block.getFieldValue('WHERE') || 'FROM_START';
    var textOrder = (where == 'RANDOM') ? Blockly.TIBasic.ORDER_NONE :
        Blockly.TIBasic.ORDER_ATOMIC;
    var text = Blockly.TIBasic.valueToCode(block, 'VALUE',
            textOrder) || '\'\'';
    switch (where) {
        case 'FIRST':
            var code = 'left(' + text + ', 1)';
            return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
        case 'LAST':
            var code = 'right(' + text + ', 1)';
            return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
        case 'FROM_START':
            var at = Blockly.TIBasic.getAdjusted(block, 'AT');
            // Adjust index if using one-based indices.
            var code = 'mid(' +  text + ', ' + at + ', 1)';
            return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
        case 'FROM_END':
            var at = Blockly.TIBasic.getAdjusted(block, 'AT', 0, true);
            var code = 'mid(' +  text + ', dim(' + text + ')' + at + ', 1)';
            return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
        case 'RANDOM':
            var code = 'mid(' + text + ', randInt(1, dim(' + text + ')), 1)';
            return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
    }
    throw 'Unhandled option (text_charAt).';
};

// NOT IMPLEMENTED IN TI-BASIC YET
// /**
//  * Returns an expression calculating the index into a string.
//  * @private
//  * @param {string} stringName Name of the string, used to calculate length.
//  * @param {string} where The method of indexing, selected by dropdown in Blockly
//  * @param {string=} opt_at The optional offset when indexing from start/end.
//  * @return {string} Index expression.
//  */
// Blockly.TIBasic.text.getIndex_ = function (stringName, where, opt_at) {
//     if (where == 'FIRST') {
//         return '0';
//     } else if (where == 'FROM_END') {
//         return stringName + '.length - 1 - ' + opt_at;
//     } else if (where == 'LAST') {
//         return stringName + '.length - 1';
//     } else {
//         return opt_at;
//     }
// };

Blockly.TIBasic['text_getSubstring'] = function (block) {
    // Get substring.
    var text = Blockly.TIBasic.valueToCode(block, 'STRING',
            Blockly.TIBasic.ORDER_FUNCTION_CALL) || '\"\"';
    var where1 = block.getFieldValue('WHERE1');
    var where2 = block.getFieldValue('WHERE2');
    if (where1 == 'FIRST' && where2 == 'LAST') {
        var code = text;
    } else if (text.match(/^'?\w+'?$/) ||
            (where1 != 'FROM_END' && where1 != 'LAST' &&
            where2 != 'FROM_END' && where2 != 'LAST')) {
            // If the text is a variable or literal or doesn't require a call for
            // length, don't generate a helper function.
            switch (where1) {
                case 'FROM_START':
                    var at1 = Blockly.TIBasic.getAdjusted(block, 'AT1');
                    break;
                case 'FROM_END':
                    var at1 = Blockly.TIBasic.getAdjusted(block, 'AT1', 1, false,
                        Blockly.TIBasic.ORDER_SUBTRACTION);
                    at1 = 'dim(' + text + ')' + at1;
                    break;
                case 'FIRST':
                    var at1 = '0';
                    break;
                default:
                    throw 'Unhandled option (text_getSubstring).';
            }
            switch (where2) {
                case 'FROM_START':
                    var at2 = Blockly.TIBasic.getAdjusted(block, 'AT2', 1);
                    break;
                case 'FROM_END':
                    var at2 = Blockly.TIBasic.getAdjusted(block, 'AT2', 0, false,
                        Blockly.TIBasic.ORDER_SUBTRACTION);
                    at2 = 'dim(' + text + ')' + at2;
                    break;
                case 'LAST':
                    var at2 = 'dim(' + text + ')';
                    break;
                default:
                    throw 'Unhandled option (text_getSubstring).';
            }
            code = 'mid(' + text + ',' + at1 + ', ' + (at2 - at1) + ')';
    } else {
        var at1 = Blockly.TIBasic.getAdjusted(block, 'AT1');
        var at2 = Blockly.TIBasic.getAdjusted(block, 'AT2');
        var getIndex_ = Blockly.TIBasic.text.getIndex_;
        var wherePascalCase = {
            'FIRST': 'First', 'LAST': 'Last',
            'FROM_START': 'FromStart', 'FROM_END': 'FromEnd'
        };
        var functionName = Blockly.TIBasic.provideFunction_(
            'subsequence' + wherePascalCase[where1] + wherePascalCase[where2],
            ['function ' + Blockly.TIBasic.FUNCTION_NAME_PLACEHOLDER_ +
            '(sequence' +
            // The value for 'FROM_END' and'FROM_START' depends on `at` so
            // we add it as a parameter.
            ((where1 == 'FROM_END' || where1 == 'FROM_START') ? ', at1' : '') +
            ((where2 == 'FROM_END' || where2 == 'FROM_START') ? ', at2' : '') +
            ') {',
                '  var start = ' + getIndex_('sequence', where1, 'at1') + ';',
                '  var end = ' + getIndex_('sequence', where2, 'at2') + ' + 1;',
                '  return sequence.slice(start, end);',
                '}']);
        var code = functionName + '(' + text +
            // The value for 'FROM_END' and 'FROM_START' depends on `at` so we
            // pass it.
            ((where1 == 'FROM_END' || where1 == 'FROM_START') ? ', ' + at1 : '') +
            ((where2 == 'FROM_END' || where2 == 'FROM_START') ? ', ' + at2 : '') +
            ')';
    }
    return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
};

// NOT IN TI-BASIC
// Blockly.TIBasic['text_changeCase'] = function (block) {
//     // Change capitalization.
//     var OPERATORS = {
//         'UPPERCASE': '.toUpperCase()',
//         'LOWERCASE': '.toLowerCase()',
//         'TITLECASE': null
//     };
//     var operator = OPERATORS[block.getFieldValue('CASE')];
//     var textOrder = operator ? Blockly.TIBasic.ORDER_MEMBER :
//         Blockly.TIBasic.ORDER_NONE;
//     var text = Blockly.TIBasic.valueToCode(block, 'TEXT',
//             textOrder) || '\'\'';
//     if (operator) {
//         // Upper and lower case are functions built into JavaScript.
//         var code = text + operator;
//     } else {
//         // Title case is not a native JavaScript function.  Define one.
//         var functionName = Blockly.TIBasic.provideFunction_(
//             'textToTitleCase',
//             ['function ' + Blockly.TIBasic.FUNCTION_NAME_PLACEHOLDER_ +
//             '(str) {',
//                 '  return str.replace(/\\S+/g,',
//                 '      function(txt) {return txt[0].toUpperCase() + ' +
//                 'txt.substring(1).toLowerCase();});',
//                 '}']);
//         var code = functionName + '(' + text + ')';
//     }
//     return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
// };
//
// Blockly.TIBasic['text_trim'] = function (block) {
//     // Trim spaces.
//     var OPERATORS = {
//         'LEFT': ".replace(/^[\\s\\xa0]+/, '')",
//         'RIGHT': ".replace(/[\\s\\xa0]+$/, '')",
//         'BOTH': '.trim()'
//     };
//     var operator = OPERATORS[block.getFieldValue('MODE')];
//     var text = Blockly.TIBasic.valueToCode(block, 'TEXT',
//             Blockly.TIBasic.ORDER_MEMBER) || '\'\'';
//     return [text + operator, Blockly.TIBasic.ORDER_FUNCTION_CALL];
// };

Blockly.TIBasic['text_print'] = function (block) {
    // Print statement.
    var msg = Blockly.TIBasic.valueToCode(block, 'TEXT',
            Blockly.TIBasic.ORDER_NONE) || '\"\"';
    return 'Disp ' + msg + ':';
};

Blockly.TIBasic['tibasic_text_prompt'] = function(block) {
  var dropdown_types = block.getFieldValue('TYPES');
  console.log(dropdown_types);
  var text_prompt = Blockly.TIBasic.valueToCode(block, 'PROMPT',
            Blockly.TIBasic.ORDER_NONE) || '\"\"';
  var variable_userinput = Blockly.TIBasic.variableDB_.getName(block.getFieldValue('USERINPUT'), Blockly.Variables.NAME_TYPE);
  var fn;
  if (dropdown_types === 'TEXT') {
      fn = 'RequestStr ';
  } else {
      fn = 'Request ';
  }
  return fn + text_prompt + ', ' + variable_userinput + ':';
};