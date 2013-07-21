/**
 * % Pandocwrapper: simple wrapper around the pandoc command
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

var pandocwrapper = {};

/** # Run pandoc
 *
 * Run the [pandoc](http://johnmacfarlane.net/pandoc) command, assuming it has
 * been installed. It converts `sourcefile` (with format `sourceformat`) to the
 * `outformat` and writes it to `outfile`. Extra options can be set through the
 * `options` hash. See for all possible options the [pandoc's manual](http://johnmacfarlane.net/pandoc/README.html).
 */

pandocwrapper.convert = function(sourcefile, sourceformat, outfile, outformat, options) {
   
        /**
         * Combine all options into one command string for the system to
         * execute.
         */

        var options_to_args = function(args, name) {
            var option = (name.length === 1) ? "-" + name: "--" + name,
                value = options[name];

            args.push(option);
            if (typeof value !== "boolean") {
                args.push(value);
            }

            return args;
        },
        command = Object
            .keys(options)
            .reduce(
                    options_to_args, 
                    ["pandoc", "--from", sourceformat, "-o", outfile, "--to", outformat]
                    )
            .concat(sourcefile)
            .join(" ");

    /**
     * Run the command. When there is a problem it'll stop and report the
     * errors.
     */

    require("child_process").exec(command, function(error, stdout, stderr) {
        if (error) {
            console.error(stderr);
            throw error;
        }
    });

};

module.exports = pandocwrapper;
