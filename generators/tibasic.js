/** TI-Basic Language added by Georgia Stuart, March 2017 **/

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
 * @fileoverview Helper functions for generating TI-Basic for blocks.
 * @author fraser@google.com (Neil Fraser)
 * @author georgia.stuart@utdallas.edu (Georgia Stuart)
 */
'use strict';

goog.provide('Blockly.TI_Basic');

goog.require('Blockly.Generator');


/**
 * TI-Basic code generator.
 * @type {!Blockly.Generator}
 */
Blockly.TIBasic = new Blockly.Generator('TIBasic');

/**
 * Disable indenting
 */
Blockly.TIBasic.INDENT = '';

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.TIBasic.addReservedWords(
    'Blockly,' +  // In case JS is evaled in the current window.
    'Define,Pgrm,EndPgrm,If,Then,ElseIf,EndIf,Disp,While,EndWhile,not,and,or,xor,nor,nand,&,#,!,%,text',
    'undef', 'count', 'augment');

/**
 * Order of operation ENUMs.
 * From the TI-NSpire Reference Guide
 */
Blockly.TIBasic.ORDER_ATOMIC = 0;           // 0 "" ...
Blockly.TIBasic.ORDER_INDIRECTION = 1;      // #
Blockly.TIBasic.ORDER_FUNCTION_CALL = 2;    // ()
Blockly.TIBasic.ORDER_POST_OPERATORS = 3;   // degrees-minutes-seconds (°,',"), factorial(!), percentage (%),
                                            // radian ( r ), subscript ([ ]), transpose ( T )
Blockly.TIBasic.ORDER_EXPONENTIATION = 4;   // Exponentiation
Blockly.TIBasic.ORDER_UNARY_NEGATION = 5;   // -
Blockly.TIBasic.ORDER_CONCATENATION = 6;    // String concatenation (&)
Blockly.TIBasic.ORDER_MULTIPLICATIVE = 7;   // Multiplication (•), division (/)
Blockly.TIBasic.ORDER_ADDITIVE = 8;         // Addition (+), subtraction (-)
Blockly.TIBasic.ORDER_RELATIONAL = 9;       // Equality relations: equal(=), not equal(≠ or /=), less than (<), less
                                            // than or equal(≤ or <=), greater than (>), greater than or equal (≥ or >=)
Blockly.TIBasic.ORDER_LOGICAL_NOT = 10;     // not
Blockly.TIBasic.ORDER_LOGICAL_AND = 11;     // and
Blockly.TIBasic.ORDER_LOGICAL_OR = 12;      // or
Blockly.TIBasic.ORDER_OTHER_LOGIC = 13;     // xor, nor, nand
Blockly.TIBasic.ORDER_IMPLICATION = 14;     // Logical Implication (⇒)
Blockly.TIBasic.ORDER_D_IMPLICATION = 15;   // Logical Double Implication, XNOR (⇔)
Blockly.TIBasic.ORDER_CONSTRAINT = 16;      // Constraint operator (“|”)
Blockly.TIBasic.ORDER_ASSIGNMENT = 17;      // Store (→), Assign (:=)
Blockly.TIBasic.ORDER_NONE = 99;            // (...)

// /**
//  * List of outer-inner pairings that do NOT require parentheses.
//  * @type {!Array.<!Array.<number>>}
//  */
// Blockly.TIBasic.ORDER_OVERRIDES = [
//   // (foo()).bar -> foo().bar
//   // (foo())[0] -> foo()[0]
//   [Blockly.TIBasic.ORDER_FUNCTION_CALL, Blockly.TIBasic.ORDER_MEMBER],
//   // (foo())() -> foo()()
//   [Blockly.TIBasic.ORDER_FUNCTION_CALL, Blockly.TIBasic.ORDER_FUNCTION_CALL],
//   // (foo.bar).baz -> foo.bar.baz
//   // (foo.bar)[0] -> foo.bar[0]
//   // (foo[0]).bar -> foo[0].bar
//   // (foo[0])[1] -> foo[0][1]
//   [Blockly.TIBasic.ORDER_MEMBER, Blockly.TIBasic.ORDER_MEMBER],
//   // (foo.bar)() -> foo.bar()
//   // (foo[0])() -> foo[0]()
//   [Blockly.TIBasic.ORDER_MEMBER, Blockly.TIBasic.ORDER_FUNCTION_CALL],
//
//   // !(!foo) -> !!foo
//   [Blockly.TIBasic.ORDER_LOGICAL_NOT, Blockly.TIBasic.ORDER_LOGICAL_NOT],
//   // a * (b * c) -> a * b * c
//   [Blockly.TIBasic.ORDER_MULTIPLICATION, Blockly.TIBasic.ORDER_MULTIPLICATION],
//   // a + (b + c) -> a + b + c
//   [Blockly.TIBasic.ORDER_ADDITION, Blockly.TIBasic.ORDER_ADDITION],
//   // a && (b && c) -> a && b && c
//   [Blockly.TIBasic.ORDER_LOGICAL_AND, Blockly.TIBasic.ORDER_LOGICAL_AND],
//   // a || (b || c) -> a || b || c
//   [Blockly.TIBasic.ORDER_LOGICAL_OR, Blockly.TIBasic.ORDER_LOGICAL_OR]
// ];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.TIBasic.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.TIBasic.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.TIBasic.functionNames_ = Object.create(null);

  if (!Blockly.TIBasic.variableDB_) {
    Blockly.TIBasic.variableDB_ =
        new Blockly.Names(Blockly.TIBasic.RESERVED_WORDS_);
  } else {
    Blockly.TIBasic.variableDB_.reset();
  }

  var defvars = [];
  var variables = workspace.variableList;
  if (variables.length) {
    for (var i = 0; i < variables.length; i++) {
      defvars[i] = Blockly.TIBasic.variableDB_.getName(variables[i],
          Blockly.Variables.NAME_TYPE);
    }
    Blockly.TIBasic.definitions_['variables'] =
        'Local ' + defvars.join(', ') + ':';
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.TIBasic.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.TIBasic.definitions_) {
    definitions.push(Blockly.TIBasic.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.TIBasic.definitions_;
  delete Blockly.TIBasic.functionNames_;
  Blockly.TIBasic.variableDB_.reset();
  // var preamble = 'Define blocklyPrgm() =\nPrgm\n';
  // var post = 'EndPrgm';
  // return preamble + definitions.join(':') + code + post;
    return definitions.join(':') + code
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.TIBasic.scrubNakedValue = function(line) {
  return line + ':';
};

/**
 * Encode a string as a properly escaped TI-Basic string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} TI-Basic string.
 * @private
 */
Blockly.TIBasic.quote_ = function(string) {
  // Replaces quotes with two to allow printing in string
  string = string.replace(/"/g, '""');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating TI-Basic from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The TI-Basic code created for this block.
 * @return {string} TI-Basic code with comments and subsequent blocks added.
 * @private
 */
Blockly.TIBasic.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.TIBasic.COMMENT_WRAP - 2);
    if (comment) {
        commentCode += Blockly.TIBasic.prefixLines(comment + ':\n', '\u00a9 ');
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.TIBasic.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.TIBasic.prefixLines(comment, '\u00a9 ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.TIBasic.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.TIBasic.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.TIBasic.ORDER_NONE;
  if (!block.workspace.options.oneBasedIndex) {
    delta++;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.TIBasic.valueToCode(block, atId,
        Blockly.TIBasic.ORDER_ADDITIVE) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.TIBasic.valueToCode(block, atId,
        Blockly.TIBasic.ORDER_ADDITIVE) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.TIBasic.valueToCode(block, atId,
        Blockly.TIBasic.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.TIBasic.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseFloat(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.TIBasic.ORDER_ADDITIVE;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.TIBasic.ORDER_ADDITIVE;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.TIBasic.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};
