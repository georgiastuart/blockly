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
 * @fileoverview Generating JavaScript for list blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.TIBasic.lists');

goog.require('Blockly.TIBasic');


Blockly.TIBasic['lists_create_empty'] = function (block) {
    // Create an empty list.
    return ['{}', Blockly.TIBasic.ORDER_ATOMIC];
};

Blockly.TIBasic['lists_create_with'] = function (block) {
    // Create a list with any number of elements of any type.
    var elements = new Array(block.itemCount_);
    for (var i = 0; i < block.itemCount_; i++) {
        elements[i] = Blockly.TIBasic.valueToCode(block, 'ADD' + i,
                Blockly.TIBasic.ORDER_ATOMIC) || 'null';
    }
    var code = '{' + elements.join(',') + '}';
    return [code, Blockly.TIBasic.ORDER_ATOMIC];
};


// NOT IMPLEMENTED IN TIBASIC BLOCKLY
// Blockly.TIBasic['lists_repeat'] = function(block) {
//   // Create a list with one element repeated.
//   var functionName = Blockly.TIBasic.provideFunction_(
//       'listsRepeat',
//       ['function ' + Blockly.TIBasic.FUNCTION_NAME_PLACEHOLDER_ +
//           '(value, n) {',
//        '  var array = [];',
//        '  for (var i = 0; i < n; i++) {',
//        '    array[i] = value;',
//        '  }',
//        '  return array;',
//        '}']);
//   var element = Blockly.TIBasic.valueToCode(block, 'ITEM',
//       Blockly.TIBasic.ORDER_COMMA) || 'null';
//   var repeatCount = Blockly.TIBasic.valueToCode(block, 'NUM',
//       Blockly.TIBasic.ORDER_COMMA) || '0';
//   var code = functionName + '(' + element + ', ' + repeatCount + ')';
//   return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
// };

Blockly.TIBasic['lists_length'] = function (block) {
    // String or array length.
    var list = Blockly.TIBasic.valueToCode(block, 'VALUE',
            Blockly.TIBasic.ORDER_ATOMIC) || '[]';
    return ['dim(' + list + ')', Blockly.TIBasic.ORDER_ATOMIC];
};

Blockly.TIBasic['lists_isEmpty'] = function (block) {
    // Is the string null or array empty?
    var list = Blockly.TIBasic.valueToCode(block, 'VALUE',
            Blockly.TIBasic.ORDER_ATOMIC) || '[]';
    return ['dim(' + list + ')=0', Blockly.TIBasic.ORDER_LOGICAL_NOT];
};

// NOT IMPLEMENTED IN TIBASIC BLOCKLY
// Blockly.TIBasic['lists_indexOf'] = function(block) {
//   // Find an item in the list.
//   var operator = block.getFieldValue('END') == 'FIRST' ?
//       'indexOf' : 'lastIndexOf';
//   var item = Blockly.TIBasic.valueToCode(block, 'FIND',
//       Blockly.TIBasic.ORDER_NONE) || '\'\'';
//   var list = Blockly.TIBasic.valueToCode(block, 'VALUE',
//       Blockly.TIBasic.ORDER_MEMBER) || '[]';
//   var code = list + '.' + operator + '(' + item + ')';
//   if (block.workspace.options.oneBasedIndex) {
//     return [code + ' + 1', Blockly.TIBasic.ORDER_ADDITION];
//   }
//   return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
// };

// NOT IMPLEMENTED IN TIBASIC BLOCKLY
// Blockly.TIBasic['lists_getIndex'] = function(block) {
//   // Get element at index.
//   // Note: Until January 2013 this block did not have MODE or WHERE inputs.
//   var mode = block.getFieldValue('MODE') || 'GET';
//   var where = block.getFieldValue('WHERE') || 'FROM_START';
//   var listOrder = (where == 'RANDOM') ? Blockly.TIBasic.ORDER_COMMA :
//       Blockly.TIBasic.ORDER_MEMBER;
//   var list = Blockly.TIBasic.valueToCode(block, 'VALUE', listOrder) || '[]';
//
//   switch (where) {
//     case ('FIRST'):
//       if (mode == 'GET') {
//         var code = list + '[0]';
//         return [code, Blockly.TIBasic.ORDER_MEMBER];
//       } else if (mode == 'GET_REMOVE') {
//         var code = list + '.shift()';
//         return [code, Blockly.TIBasic.ORDER_MEMBER];
//       } else if (mode == 'REMOVE') {
//         return list + '.shift();\n';
//       }
//       break;
//     case ('LAST'):
//       if (mode == 'GET') {
//         var code = list + '.slice(-1)[0]';
//         return [code, Blockly.TIBasic.ORDER_MEMBER];
//       } else if (mode == 'GET_REMOVE') {
//         var code = list + '.pop()';
//         return [code, Blockly.TIBasic.ORDER_MEMBER];
//       } else if (mode == 'REMOVE') {
//         return list + '.pop();\n';
//       }
//       break;
//     case ('FROM_START'):
//       var at = Blockly.TIBasic.getAdjusted(block, 'AT');
//       if (mode == 'GET') {
//         var code = list + '[' + at + ']';
//         return [code, Blockly.TIBasic.ORDER_MEMBER];
//       } else if (mode == 'GET_REMOVE') {
//         var code = list + '.splice(' + at + ', 1)[0]';
//         return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
//       } else if (mode == 'REMOVE') {
//         return list + '.splice(' + at + ', 1);\n';
//       }
//       break;
//     case ('FROM_END'):
//       var at = Blockly.TIBasic.getAdjusted(block, 'AT', 1, true);
//       if (mode == 'GET') {
//         var code = list + '.slice(' + at + ')[0]';
//         return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
//       } else if (mode == 'GET_REMOVE') {
//         var code = list + '.splice(' + at + ', 1)[0]';
//         return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
//       } else if (mode == 'REMOVE') {
//         return list + '.splice(' + at + ', 1);';
//       }
//       break;
//     case ('RANDOM'):
//       var functionName = Blockly.TIBasic.provideFunction_(
//           'listsGetRandomItem',
//           ['function ' + Blockly.TIBasic.FUNCTION_NAME_PLACEHOLDER_ +
//               '(list, remove) {',
//            '  var x = Math.floor(Math.random() * list.length);',
//            '  if (remove) {',
//            '    return list.splice(x, 1)[0];',
//            '  } else {',
//            '    return list[x];',
//            '  }',
//            '}']);
//       code = functionName + '(' + list + ', ' + (mode != 'GET') + ')';
//       if (mode == 'GET' || mode == 'GET_REMOVE') {
//         return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
//       } else if (mode == 'REMOVE') {
//         return code + ';\n';
//       }
//       break;
//   }
//   throw 'Unhandled combination (lists_getIndex).';
// };

Blockly.TIBasic['lists_setIndex'] = function (block) {
    // Set element at index.
    // Note: Until February 2013 this block did not have MODE or WHERE inputs.
    var list = Blockly.TIBasic.valueToCode(block, 'LIST',
            Blockly.TIBasic.ORDER_ATOMIC) || '[]';
    var mode = block.getFieldValue('MODE') || 'GET';
    var where = block.getFieldValue('WHERE') || 'FROM_START';
    var value = Blockly.TIBasic.valueToCode(block, 'TO',
            Blockly.TIBasic.ORDER_ASSIGNMENT) || 'null';
    // Cache non-trivial values to variables to prevent repeated look-ups.
    // Closure, which accesses and modifies 'list'.
    function cacheList() {
        if (list.match(/^\w+$/)) {
            return '';
        }
        var listVar = Blockly.TIBasic.variableDB_.getDistinctName(
            'tmpList', Blockly.Variables.NAME_TYPE);
        var code = 'var ' + listVar + ' = ' + list + ';\n';
        list = listVar;
        return code;
    }

    switch (where) {
        case ('FIRST'):
            if (mode == 'SET') {
                return list + '[1] := ' + value + ':';
            } else if (mode == 'INSERT') {
                return list + ':=augment({' + value + '},' + list + '):';
            }
            break;
        case ('LAST'):
            if (mode == 'SET') {
                var code = cacheList();
                code += list + '[dim(' + list + ')] := ' + value + ':';
                return code;
            } else if (mode == 'INSERT') {
                return list + ':=augment(' + list + ',{' + value + '}):';
            }
            break;
        case ('FROM_START'):
            var tempList = Blockly.TIBasic.variableDB_.getDistinctName(
                'tempList', Blockly.Variables.NAME_TYPE);
            var at = Blockly.TIBasic.getAdjusted(block, 'AT');
            if (mode == 'SET') {
                return list + '[' + at + '] := ' + value + ':';
            } else if (mode == 'INSERT') {
                var code = tempList + ':=augment(mid(' + list + ',1,' + (at - 1) + '),' + '{' + value + '}):';
                code += list + ':=augment(' + tempList + ',mid(' + list + ',' + at + ')):';
                return code;
            }
            break;
        case ('FROM_END'):
            var at = Blockly.TIBasic.getAdjusted(block, 'AT', 1, false,
                Blockly.TIBasic.ORDER_ADDITIVE);
            var tempList = Blockly.TIBasic.variableDB_.getDistinctName(
                'tempList', Blockly.Variables.NAME_TYPE);
            if (mode == 'SET') {
                code = list + '[dim(' + list + ') - ' + (at - 2) + '] := ' + value + ':';
                return code;
            } else if (mode == 'INSERT') {
                var code = tempList + ':=augment(mid(' + list + ',1,dim(' + list + ') - ' + (at - 2) + '),' + '{' + value + '}):';
                code += list + ':=augment(' + tempList + ',mid(' + list + ',dim(' + list + ') - ' + (at - 3) + ')):';
                return code;
            }
            break;
        // NOT IMPLEMENTED IN TI-BASIC BLOCKLY
        // case ('RANDOM'):
        //     var code = cacheList();
        //     var xVar = Blockly.TIBasic.variableDB_.getDistinctName(
        //         'tmpX', Blockly.Variables.NAME_TYPE);
        //     code += 'var ' + xVar + ' = Math.floor(Math.random() * ' + list +
        //         '.length);\n';
        //     if (mode == 'SET') {
        //         code += list + '[' + xVar + '] = ' + value + ';\n';
        //         return code;
        //     }
        //     // } else if (mode == 'INSERT') {
        //     //     code += list + '.splice(' + xVar + ', 0, ' + value + ');\n';
        //     //     return code;
        //     // }
        //     break;
    }
    throw 'Unhandled combination (lists_setIndex).';
};

// NOT IMPLEMENTED IN TI-BASIC BLOCKLY
// /**
//  * Returns an expression calculating the index into a list.
//  * @private
//  * @param {string} listName Name of the list, used to calculate length.
//  * @param {string} where The method of indexing, selected by dropdown in Blockly
//  * @param {string=} opt_at The optional offset when indexing from start/end.
//  * @return {string} Index expression.
//  */
// Blockly.TIBasic.lists.getIndex_ = function (listName, where, opt_at) {
//     if (where == 'FIRST') {
//         return '0';
//     } else if (where == 'FROM_END') {
//         return listName + '.length - 1 - ' + opt_at;
//     } else if (where == 'LAST') {
//         return listName + '.length - 1';
//     } else {
//         return opt_at;
//     }
// };

Blockly.TIBasic['lists_getSublist'] = function (block) {
    // Get sublist.
    var list = Blockly.TIBasic.valueToCode(block, 'LIST',
            Blockly.TIBasic.ORDER_ATOMIC) || '[]';
    var where1 = block.getFieldValue('WHERE1');
    var where2 = block.getFieldValue('WHERE2');
    if (where1 == 'FIRST' && where2 == 'LAST') {
        var code = list + '.slice(0)';
    } else if (list.match(/^\w+$/) ||
        (where1 != 'FROM_END' && where2 == 'FROM_START')) {
        // If the list is a variable or doesn't require a call for length, don't
        // generate a helper function.
        switch (where1) {
            case 'FROM_START':
                var at1 = Blockly.TIBasic.getAdjusted(block, 'AT1');
                break;
            case 'FROM_END':
                var at1 = Blockly.TIBasic.getAdjusted(block, 'AT1', 1, false,
                    Blockly.TIBasic.ORDER_ADDITIVE);
                at1 = 'dim(' + list + ') - ' + at1;
                break;
            case 'FIRST':
                var at1 = '0';
                break;
            default:
                throw 'Unhandled option (lists_getSublist).';
        }
        switch (where2) {
            case 'FROM_START':
                var at2 = Blockly.TIBasic.getAdjusted(block, 'AT2', 1);
                break;
            case 'FROM_END':
                var at2 = Blockly.TIBasic.getAdjusted(block, 'AT2', 0, false,
                    Blockly.TIBasic.ORDER_ADDITIVE);
                at2 = 'dim(' + list + ') - ' + at2;
                break;
            case 'LAST':
                var at2 = list + '.length';
                break;
            default:
                throw 'Unhandled option (lists_getSublist).';
        }
        code = 'mid(' + list + ',' + at1 + ',' + at2 - at1 + ')';
    } else {
        var at1 = Blockly.TIBasic.getAdjusted(block, 'AT1');
        var at2 = Blockly.TIBasic.getAdjusted(block, 'AT2');
        var getIndex_ = Blockly.TIBasic.lists.getIndex_;
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
        var code = functionName + '(' + list +
            // The value for 'FROM_END' and 'FROM_START' depends on `at` so we
            // pass it.
            ((where1 == 'FROM_END' || where1 == 'FROM_START') ? ', ' + at1 : '') +
            ((where2 == 'FROM_END' || where2 == 'FROM_START') ? ', ' + at2 : '') +
            ')';
    }
    return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
};

Blockly.TIBasic['lists_sort'] = function (block) {
    // Block for sorting a list.
    var list = Blockly.TIBasic.valueToCode(block, 'LIST',
            Blockly.TIBasic.ORDER_FUNCTION_CALL) || '[]';
    var direction = block.getFieldValue('DIRECTION') === '1' ? 1 : -1;
    if (direction === 1) {
        return 'sortA(' + list + ')';
    } else {
        return 'sortD(' + list + ')';
    }
    // var type = block.getFieldValue('TYPE');
    // var getCompareFunctionName = Blockly.TIBasic.provideFunction_(
    //     'listsGetSortCompare',
    //     ['function ' + Blockly.TIBasic.FUNCTION_NAME_PLACEHOLDER_ +
    //     '(type, direction) {',
    //         '  var compareFuncs = {',
    //         '    "NUMERIC": function(a, b) {',
    //         '        return parseFloat(a) - parseFloat(b); },',
    //         '    "TEXT": function(a, b) {',
    //         '        return a.toString() > b.toString() ? 1 : -1; },',
    //         '    "IGNORE_CASE": function(a, b) {',
    //         '        return a.toString().toLowerCase() > ' +
    //         'b.toString().toLowerCase() ? 1 : -1; },',
    //         '  };',
    //         '  var compare = compareFuncs[type];',
    //         '  return function(a, b) { return compare(a, b) * direction; }',
    //         '}']);
    // return [list + '.slice().sort(' +
    // getCompareFunctionName + '("' + type + '", ' + direction + '))',
    //     Blockly.TIBasic.ORDER_FUNCTION_CALL];
};

// NOT IMPLEMENTED IN TIBASIC BLOCKLY
// Blockly.TIBasic['lists_split'] = function (block) {
//     // Block for splitting text into a list, or joining a list into text.
//     var input = Blockly.TIBasic.valueToCode(block, 'INPUT',
//         Blockly.TIBasic.ORDER_MEMBER);
//     var delimiter = Blockly.TIBasic.valueToCode(block, 'DELIM',
//             Blockly.TIBasic.ORDER_NONE) || '\'\'';
//     var mode = block.getFieldValue('MODE');
//     if (mode == 'SPLIT') {
//         if (!input) {
//             input = '\'\'';
//         }
//         var functionName = 'split';
//     } else if (mode == 'JOIN') {
//         if (!input) {
//             input = '[]';
//         }
//         var functionName = 'join';
//     } else {
//         throw 'Unknown mode: ' + mode;
//     }
//     var code = input + '.' + functionName + '(' + delimiter + ')';
//     return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
// };
