
var pandocwrapper = {};

pandocwrapper.convert = function(sourcefile, sourceformat, outfile, outformat, options) {
    
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

    require("child_process").exec(command, function(error, stdout, stderr) {
        if (error) {
            console.error(stderr);
            throw error;
        }
    });

};

module.exports = pandocwrapper;
