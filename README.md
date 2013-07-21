Incodoc
=======

Invert markdown annotated source code to code describing markdown documentation

Huub de Beer 

2013-07-20

-   Install
-   Usage
-   Licence

Install
=======

Install incodoc by:

~~~~ {.bash}
npm install -g incodoc
~~~~

Usage
=====

Incodoc parses javascript source code into a sequence of subsequent blocks. A block is
either markdown documentation or javascript code. A markdown documentation
block is recognized by:

-   it starts with a line containing only /\*\*, excluding whitespace,
-   it ends with a line containing only \* immediately followed by /, excluding
    whitespace,
-   every line in between starts with a \*, possibly preceded by some whitespace.
    
Everything outside a markdown documentation block is recognized as a code
block.

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

as well through the `-f` option.

Finally, you can specify a special CSS stylesheet via the `-s` option. If no stylesheet is specified, the generated HTML file points to `style.css`.


Licence
=======

Copyright (C) 2013 Huub de Beer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
