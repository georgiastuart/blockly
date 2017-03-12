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
 * @fileoverview Generating JavaScript for math blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.TIBasic.math');

goog.require('Blockly.TIBasic');


Blockly.TIBasic['math_number'] = function (block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    return [code, Blockly.TIBasic.ORDER_ATOMIC];
};

Blockly.TIBasic['math_arithmetic'] = function (block) {
    // Basic arithmetic operators, and power.
    var OPERATORS = {
        'ADD': [' + ', Blockly.TIBasic.ORDER_ADDITIVE],
        'MINUS': [' - ', Blockly.TIBasic.ORDER_ADDITIVE],
        'MULTIPLY': [' * ', Blockly.TIBasic.ORDER_MULTIPLICATIVE],
        'DIVIDE': [' / ', Blockly.TIBasic.ORDER_MULTIPLICATIVE],
        'POWER': [' ^ ', Blockly.TIBasic.ORDER_EXPONENTIATION]  // Handle power separately.
    };
    var tuple = OPERATORS[block.getFieldValue('OP')];
    var operator = tuple[0];
    var order = tuple[1];
    var argument0 = Blockly.TIBasic.valueToCode(block, 'A', order) || '0';
    var argument1 = Blockly.TIBasic.valueToCode(block, 'B', order) || '0';
    var code;
    code = argument0 + operator + argument1;
    return [code, order];
};

Blockly.TIBasic['math_single'] = function (block) {
    // Math operators with single operand.
    var operator = block.getFieldValue('OP');
    var code;
    var arg;
    if (operator == 'NEG') {
        // Negation is a special case given its different operator precedence.
        arg = Blockly.TIBasic.valueToCode(block, 'NUM',
                Blockly.TIBasic.ORDER_UNARY_NEGATION) || '0';
        if (arg[0] == '-') {
            // --3 is not legal in JS.
            arg = ' ' + arg;
        }
        code = '-' + arg;
        return [code, Blockly.TIBasic.ORDER_UNARY_NEGATION];
    }
    if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
        arg = Blockly.TIBasic.valueToCode(block, 'NUM',
                Blockly.TIBasic.ORDER_MULTIPLICATIVE) || '0';
    } else {
        arg = Blockly.TIBasic.valueToCode(block, 'NUM',
                Blockly.TIBasic.ORDER_NONE) || '0';
    }
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
        case 'ABS':
            code = 'abs(' + arg + ')';
            break;
        case 'ROOT':
            code = 'sqrt(' + arg + ')';
            break;
        case 'LN':
            code = 'ln(' + arg + ')';
            break;
        case 'EXP':
            code = 'exp(' + arg + ')';
            break;
        case 'POW10':
            code = '10^' + arg;
            break;
        // case 'ROUND':
        //   code = 'Math.round(' + arg + ')';
        //   break;
        // case 'ROUNDUP':
        //   code = 'Math.ceil(' + arg + ')';
        //   break;
        // case 'ROUNDDOWN':
        //   code = 'Math.floor(' + arg + ')';
        //   break;
        case 'SIN':
            code = 'sin(' + arg + ')';
            break;
        case 'COS':
            code = 'cos(' + arg + ')';
            break;
        case 'TAN':
            code = 'tan(' + arg + ')';
            break;
        case 'ASIN':
            code = 'arcsin(' + arg + ')';
            break;
        case 'ACOS':
            code = 'arccos(' + arg + ')';
            break;
        case 'ATAN':
            code = 'arctan(' + arg + ')';
            break;
    }
    if (code) {
        return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
    }
    // Second, handle cases which generate values that may need parentheses
    // wrapping the code.
    // switch (operator) {
    //     case 'LOG10':
    //         code = 'Math.log(' + arg + ') / Math.log(10)';
    //         break;
    //     case 'ASIN':
    //         code = 'Math.asin(' + arg + ') / Math.PI * 180';
    //         break;
    //     case 'ACOS':
    //         code = 'Math.acos(' + arg + ') / Math.PI * 180';
    //         break;
    //     case 'ATAN':
    //         code = 'Math.atan(' + arg + ') / Math.PI * 180';
    //         break;
    //     default:
    //         throw 'Unknown math operator: ' + operator;
    // }
    return [code, Blockly.TIBasic.ORDER_MULTIPLICATIVE];
};

Blockly.TIBasic['math_constant'] = function (block) {
    // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
    var CONSTANTS = {
        'PI': ['pi', Blockly.TIBasic.ORDER_MEMBER],
        'E': ['@e', Blockly.TIBasic.ORDER_MEMBER],
        'GOLDEN_RATIO': ['(1 + sqrt(5)) / 2', Blockly.TIBasic.ORDER_DIVISION],
        'SQRT2': ['sqrt(2)', Blockly.TIBasic.ORDER_MEMBER],
        'SQRT1_2': ['sqrt(1/2)', Blockly.TIBasic.ORDER_MEMBER],
        'INFINITY': ['infinity', Blockly.TIBasic.ORDER_ATOMIC]
    };
    return CONSTANTS[block.getFieldValue('CONSTANT')];
};

// Blockly.TIBasic['math_number_property'] = function (block) {
//     // Check if a number is even, odd, prime, whole, positive, or negative
//     // or if it is divisible by certain number. Returns true or false.
//     var number_to_check = Blockly.TIBasic.valueToCode(block, 'NUMBER_TO_CHECK',
//             Blockly.TIBasic.ORDER_MODULUS) || '0';
//     var dropdown_property = block.getFieldValue('PROPERTY');
//     var code;
//     if (dropdown_property == 'PRIME') {
//         // Prime is a special case as it is not a one-liner test.
//         var functionName = Blockly.TIBasic.provideFunction_(
//             'mathIsPrime',
//             ['function ' + Blockly.TIBasic.FUNCTION_NAME_PLACEHOLDER_ + '(n) {',
//                 '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
//                 '  if (n == 2 || n == 3) {',
//                 '    return true;',
//                 '  }',
//                 '  // False if n is NaN, negative, is 1, or not whole.',
//                 '  // And false if n is divisible by 2 or 3.',
//                 '  if (isNaN(n) || n <= 1 || n % 1 != 0 || n % 2 == 0 ||' +
//                 ' n % 3 == 0) {',
//                 '    return false;',
//                 '  }',
//                 '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
//                 '  for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {',
//                 '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
//                 '      return false;',
//                 '    }',
//                 '  }',
//                 '  return true;',
//                 '}']);
//         code = functionName + '(' + number_to_check + ')';
//         return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
//     }
//     switch (dropdown_property) {
//         case 'EVEN':
//             code = number_to_check + ' % 2 == 0';
//             break;
//         case 'ODD':
//             code = number_to_check + ' % 2 == 1';
//             break;
//         case 'WHOLE':
//             code = number_to_check + ' % 1 == 0';
//             break;
//         case 'POSITIVE':
//             code = number_to_check + ' > 0';
//             break;
//         case 'NEGATIVE':
//             code = number_to_check + ' < 0';
//             break;
//         case 'DIVISIBLE_BY':
//             var divisor = Blockly.TIBasic.valueToCode(block, 'DIVISOR',
//                     Blockly.TIBasic.ORDER_MODULUS) || '0';
//             code = number_to_check + ' % ' + divisor + ' == 0';
//             break;
//     }
//     return [code, Blockly.TIBasic.ORDER_EQUALITY];
// };

// Blockly.TIBasic['math_change'] = function (block) {
//     // Add to a variable in place.
//     var argument0 = Blockly.TIBasic.valueToCode(block, 'DELTA',
//             Blockly.TIBasic.ORDER_ADDITION) || '0';
//     var varName = Blockly.TIBasic.variableDB_.getName(
//         block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
//     return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
//         ' : 0) + ' + argument0 + ';\n';
// };

// Rounding functions have a single operand.
Blockly.TIBasic['math_round'] = Blockly.TIBasic['math_single'];
// Trigonometry functions have a single operand.
Blockly.TIBasic['math_trig'] = Blockly.TIBasic['math_single'];

Blockly.TIBasic['math_on_list'] = function (block) {
    // Math functions for lists.
    var func = block.getFieldValue('OP');
    var list, code;
    switch (func) {
        case 'SUM':
            list = Blockly.TIBasic.valueToCode(block, 'LIST',
                    Blockly.TIBasic.ORDER_MEMBER) || '{}';
            code = 'sum(' + list + ')';
            break;
        case 'MIN':
            list = Blockly.TIBasic.valueToCode(block, 'LIST',
                    Blockly.TIBasic.ORDER_COMMA) || '{}';
            code = 'min(' + list + ')';
            break;
        case 'MAX':
            list = Blockly.TIBasic.valueToCode(block, 'LIST',
                    Blockly.TIBasic.ORDER_COMMA) || '{}';
            code = 'max(' + list + ')';
            break;
        case 'AVERAGE':
            list = Blockly.TIBasic.valueToCode(block, 'LIST',
            Blockly.TIBasic.ORDER_COMMA) || '{}';
            code = 'mean(' + list + ')';
            break;
        case 'MEDIAN':
            list = Blockly.TIBasic.valueToCode(block, 'LIST',
            Blockly.TIBasic.ORDER_COMMA) || '{}';
            code = 'median(' + list + ')';
            break;
        // case 'MODE':
        //     list = Blockly.TIBasic.valueToCode(block, 'LIST',
        //     Blockly.TIBasic.ORDER_COMMA) || '{}';
        //     code = 'mode(' + list + ')';
        //     break;
        case 'STD_DEV':
            list = Blockly.TIBasic.valueToCode(block, 'LIST',
            Blockly.TIBasic.ORDER_COMMA) || '{}';
            code = 'stdDev(' + list + ')';
            break;
        // case 'RANDOM':
        //     var functionName = Blockly.TIBasic.provideFunction_(
        //         'mathRandomList',
        //         ['function ' + Blockly.TIBasic.FUNCTION_NAME_PLACEHOLDER_ +
        //         '(list) {',
        //             '  var x = Math.floor(Math.random() * list.length);',
        //             '  return list[x];',
        //             '}']);
        //     list = Blockly.TIBasic.valueToCode(block, 'LIST',
        //             Blockly.TIBasic.ORDER_NONE) || '{}';
        //     code = functionName + '(' + list + ')';
        //     break;
        default:
            throw 'Unknown operator: ' + func;
    }
    return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
};

Blockly.TIBasic['math_modulo'] = function (block) {
    // Remainder computation.
    var argument0 = Blockly.TIBasic.valueToCode(block, 'DIVIDEND',
            Blockly.TIBasic.ORDER_MULTIPLICATIVE) || '0';
    var argument1 = Blockly.TIBasic.valueToCode(block, 'DIVISOR',
            Blockly.TIBasic.ORDER_MULTIPLICATIVE) || '0';
    var code = 'mod(' + argument0 + ', ' + argument1 +  ')';
    return [code, Blockly.TIBasic.ORDER_MULTIPLICATIVE];
};

// Blockly.TIBasic['math_constrain'] = function (block) {
//     // Constrain a number between two limits.
//     var argument0 = Blockly.TIBasic.valueToCode(block, 'VALUE',
//             Blockly.TIBasic.ORDER_COMMA) || '0';
//     var argument1 = Blockly.TIBasic.valueToCode(block, 'LOW',
//             Blockly.TIBasic.ORDER_COMMA) || '0';
//     var argument2 = Blockly.TIBasic.valueToCode(block, 'HIGH',
//             Blockly.TIBasic.ORDER_COMMA) || 'Infinity';
//     var code = 'Math.min(Math.max(' + argument0 + ', ' + argument1 + '), ' +
//         argument2 + ')';
//     return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
// };

Blockly.TIBasic['math_random_int'] = function (block) {
    // Random integer between [X] and [Y].
    var argument0 = Blockly.TIBasic.valueToCode(block, 'FROM',
            Blockly.TIBasic.ORDER_ATOMIC) || '0';
    var argument1 = Blockly.TIBasic.valueToCode(block, 'TO',
            Blockly.TIBasic.ORDER_ATOMIC) || '0';
    var code = 'randInt(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.TIBasic.ORDER_FUNCTION_CALL];
};

Blockly.TIBasic['math_random_float'] = function (block) {
    // Random fraction between 0 and 1.
    return ['rand()', Blockly.TIBasic.ORDER_FUNCTION_CALL];
};
