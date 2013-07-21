Incodoc 
=======

Invert markdown annotated source code to code describing markdown documentation 

Huub de Beer 

2013-07-20

-   Install
-   Usage
-   Licence
-   Implementation
    -   Define and check options using
    -   Inversion process


~~~~ {.javascript}
#!/usr/bin/env node
"use strict";
~~~~

Install
=======

Install incodoc by:

~~~~ {.bash}
npm install -g incodoc
~~~~

Usage
=====

The most simplest usage is:

~~~~ {.bash}
incodoc file1 file2 ... fileN
~~~~

That command inverts all files listed and places the generated documentation in the current working directory.

If you want, you can enable linenumbers in code blocks as well as choose another highlighting style via, for example:

~~~~ {.bash}
incodoc -l -h monochrome file1
~~~~

This will show linenumbers as well as choose the monochrome style. Possible styles are:

-   pygments
-   kate
-   monochrome
-   espresso
-   haddock
-   tango
-   zenburn

(as per http://johnmacfarlane.net/pandoc/demos.html)

If another output format is desired, you can select

-   'plain', '
-   rst',
-   'odt',
-   'docbook',
-   'latex',
-   'github',
-   'man'

as well.

Finally, you can specify a special CSS stylesheet via the `-s` option. If no stylesheet is specified, the generated HTML file points to `style.css`.

Licence
=======

Copyright (C) 2013 Huub de Beer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Implementation
==============

Define and check options using
------------------------------

[optimist](https://github.com/substack/node-optimist)

~~~~ {.javascript}
var argv = require('optimist')
    .usage("Inverts comments in javascript program to markdown and code lines to markdown code blocks. optimist [-n] [-f format] filename")
    .describe("f", "One of the following output formats: docbook, github, html, latex, man, markdown, odt, plain, rst")
    .alias("f", "format")
    .default("f", "html")
    .describe("h", "One of the following code highlight styles: pygments, kate, monochrome, espresso, zenburn, haddock, tango")
    .alias("h", "highlight")
    .default("h", "kate")
    .boolean("l")
    .alias("l", "linenumbers")
    .describe("l", "Add linenumbers to code blocks")
    .describe("s", "CSS file to style the generated documentation")
    .alias("s", "style")
    .default("s", "style.css")
    .argv;


var HIGHLIGHT_STYLES = ["pygments", "kate", "monochrome", "espresso", "zenburn", "haddock", "tango"],
    OUTPUT_FORMATS = [{
        name: 'docbook',
        pandoc: 'docbook',
        extension: 'dbk'
    }, {
        name: 'html',
        pandoc: 'html5',
        extension: 'html'
    }, {
        name: 'latex',
        pandoc: 'latex',
        extension: 'tex'
    }, {
        name: 'markdown',
        pandoc: 'markdown',
        extension: 'markdown'
    }, {
        name: 'plain',
        pandoc: 'plain',
        extension: 'txt'
    }, {
        name: 'github',
        pandoc: 'markdown_github',
        extension: 'md'
    }, {
        name: 'man',
        pandoc: 'man',
        extension: 'man'
    }, {
        name: 'odt',
        pandoc: 'odt',
        extension: 'odt'
    }, {
        name: 'rst',
        pandoc: 'rst',
        extension: 'rst'
    }],          
    find_output = function(format) {
        return format.name === argv.f;
    },
    FORMAT = OUTPUT_FORMATS.filter(find_output),
    HIGHLIGHT = argv.h,
    LINE_NUMBERS = argv.l,
    FILES = argv._;

// Check and set options set by the user

if (FORMAT.length !== 1) {
    var output_name = function(format) {
        return format.name;
    };
    console.error("Output format should be one of: " + OUTPUT_FORMATS.map(output_name).join(", ") + "; it is now: " + argv.f);
    process.exit(1);
}
FORMAT = FORMAT[0];

if (HIGHLIGHT_STYLES.indexOf(HIGHLIGHT) === -1) {
    console.error("Code highlighting style should be one of: " + HIGHLIGHT_STYLES.join(", ") + "; it is now: " + HIGHLIGHT);
    process.exit(1);
}

if (FILES.length === 0) {
    console.error("No javascript files to invert listed");
    process.exit(1);
} else {

    var check_files = function(filename) {
        // does it exists, and is its extension .js?    
    };

    FILES.forEach(check_files);
}


~~~~

Inversion process
-----------------

After all options are gathered and checked, the actual inversion process starts by using two modules:

-   The [incodoc module](doc/incodoc.html) parses and inverts the source code
-   The [pandocwrapper module](doc/pandocwrapper.html) calls the [pandoc](http://johnmacfarlane.net/pandoc/README.html) command to convert the markdown documentation into HTML (or some other format)

Uses the [temporary](https://github.com/vesln/temporary) package to create a temporary file to use in the pandoc-conversion.

~~~~ {.javascript}

var incodoc = require("../lib/incodoc")({line_numbers: LINE_NUMBERS }),
    pandoc = require("../lib/pandocwrapper"),
    fs = require("fs"),
    path = require("path"),
    default_style = "style.css",
    Tempfile = require("temporary/lib/file");

var process_file = function(filename) {
    var infile = filename,
        outfile = path.basename(filename, ".js") + "." + FORMAT.extension,
        tempfile = new Tempfile();

    var process = function(err, source_code) {
        if (err) throw err;

        fs.writeFileSync(tempfile.path, incodoc.invert(source_code));

        pandoc.convert(tempfile.path, 'markdown', outfile, FORMAT.pandoc, {
            "highlight-style": HIGHLIGHT,
            "toc": true,
            "standalone": true,
            "css": default_style
        });

    };

    fs.readFile(infile, 'utf-8', process);
    tempfile.unlink();
};

FILES.forEach(process_file);
~~~~
