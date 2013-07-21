/**
 * % Incodoc: invert markdown annotated source code to code describing markdown documentation
 * % Huub de Beer
 * % 2013-07-20
 *
 * # Licence
 * 
 * Copyright (C) 2013 Huub de Beer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * # Implementation
 */

var incodoc = function( config ) {

    /**
     * ## Parse javascript source code
     *
     * Parse javascript source code into a sequence of subsequent blocks. A
     * block is either markdown documentation or javascript code. A markdown
     * documentation block is recognized by:
     *
     *  -   it starts with a line containing only `/**`, excluding whitespace,
     *  -   it ends with a line containing only `*` immediately followed by `/`, excluding whitespace,
     *  -   every line in between starts with a `*`, possibly preceded by
     *      some whitespace.
     *
     * Everything outside a markdown documentation block is recognized as a
     * code block. 
     */

    var parse = function( source ) {

        /**
         * We write a simple recursive descent parser that recognizes the
         * different blocks line by line. The `next_line`
         * function advances the current line to the next in the source code,
         * storing and returning that line. When the parser follows a dead end,
         * the next line can be re-added to the source code to try to recognize
         * another kind of block.
         */

        var lines = source.split( "\n" ),
            line,
            line_number = 0,
            next_line = function() {
                line = lines.shift();
                line_number++;
                return line;
            },
            unnext_line = function() {
                lines.unshift( line );
                line_number--;
            };

        var DOC_START = /^\s*\/\*\*(.*)$/,
            DOC_CONTINUE = /^\s*\*(.*)$/,
            DOC_END = /^\s*\*\/(.*)$/;

        var parse_documentation_block = function() {
                var block = [];
                while (lines.length > 0 && !DOC_END.test( next_line() )) {
                    if (DOC_CONTINUE.test( line )) {
                        block.push( DOC_CONTINUE.exec(line)[1].trim() );
                    } else {
                        throw new Error( 
                                "Expected a documentation line starting with * at line " +
                                line_number +
                                ", instead found '" +
                                line +
                                "'"
                                );
                    }
                }

                if (lines.length > 0) {
                    return block.join( "\n" );
                } else{
                    throw new Error( "Unexpected EOF while parsing documentation block" );
                }
            };

        var parse_code_block = function() {
                var block = [];
                while (lines.length > 0 && !DOC_START.test( next_line() )) {
                    block.push( line );
                }

                if (lines.length > 0) unnext_line();

                return block.join( "\n" );
            };

        var parse_block = function() {
                if (DOC_START.test( next_line() )) {
                    return {
                        type: "documentation",
                        content: parse_documentation_block()
                    };
                } else {
                    unnext_line();
                    return {
                        type: "code",
                        content: parse_code_block()
                    };
                }
            };

        var blocks = [];

        while (lines.length > 0) {
            blocks.push( parse_block() );
        }

        return blocks;
    };


    /** 
     * ## Generate documentation
     *
     * From a sequence of blocks recognized by the `parse` function the code
     * describing markdown documentation is generated by concatenating all
     * block separated by newlines. Furthermore, all code blocks are enclosed
     * by special lines to create so called [fenced code blocks](http://johnmacfarlane.net/pandoc/README.html#fenced-code-blocks).
     * The fences are decorated with the name of the source language
     * (javascript) to enable syntax highlighting in the generated
     * documentation. If `SHOW_LINE_NUMBERS` is set, a flag to enable line
     * numbers in the generated documentation is set. Line numbers and syntax
     * highlighting is only visible after processing the generated
     * documentation with [pandoc](http://johnmacfarlane.net/pandoc).
     */

    var SHOW_LINE_NUMBERS = config.line_numbers || false;

    var generate_documentation = function( blocks ) {

        var CODE_BLOCK_START = "\n~~~ {.javascript" + (SHOW_LINE_NUMBERS?" .lineNumbers":"") + "}\n",
            CODE_BLOCK_END = "\n~~~\n";

        var convert_block = function( documentation, block ) {
            switch (block.type) {
                case "documentation":
                    documentation += "\n" + block.content + "\n";
                    break;
                case "code":
                    documentation += CODE_BLOCK_START + block.content + CODE_BLOCK_END;
                    break;
            }
            return documentation;
        };

        return blocks.reduce(convert_block, "");
    };

    /**
     * # Public interface
     *
     * The incodoc module is accessible through its `invert` function. This
     * function generates the code describing markdown documentation given a
     * markdown documented source file.
     */

    return {
        invert: function( source ) {
            return generate_documentation( parse( source ) ).trim();
        }
    };

};

module.exports = incodoc;
