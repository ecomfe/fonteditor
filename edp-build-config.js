var path = require( 'path' );

exports.input = __dirname;
exports.output = path.resolve(__dirname, './release');


exports.getProcessors = function () {


    return [ 
        new LessCompiler( {
            files: [
                'css/main.less',
                'css/preview.less'
            ],
            compileOptions: {
                relativeUrls: false
            }
        }),
        new ModuleCompiler( {
            files: [
                'src/fonteditor/main.js'
            ],
            configFile: './module.conf'
        }),

        new JsCompressor({
            files: [
                'src/fonteditor/main.js'
            ]
        }),

        // 清除冗余文件，比如`less`
        new OutputCleaner({
            files: [
                'css/common/*',
                'src/common/*',
                'src/editor/*',
                'src/editor/*/*',
                'src/editor/*/*/*',
                'src/graphics/*',
                'src/graphics/join/*',
                'src/math/*',
                'src/render/*',
                'src/render/*/*',
                'src/render/*/*/*',
                'src/ttf/*',
                'src/ttf/*/*',
                'src/ttf/*/*/*',
                'src/fonteditor/dialog/*',
                'src/fonteditor/widget/*',
                'src/fonteditor/controller/*',
                'src/fonteditor/data/*'
            ]
        })
    ];
};

exports.exclude = [
    ".svn",
    "*.conf",
    "*.sh",
    "*.bat",
    "*.md",
    "demo",
    "agent/*",
    "mock",
    "test/*",
    "edp-*",
    "output",
    ".DS_Store",
    ".gitignore",
    "package.json"
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

