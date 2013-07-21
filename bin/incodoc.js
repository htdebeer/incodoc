
"use strict";

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

// Invert each file listed

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
