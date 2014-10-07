var path = require( 'path' );

exports.input = __dirname;
exports.output = path.resolve(__dirname, './release');


exports.getProcessors = function () {


    return [ 
        new LessCompiler( {
            files: ['css/ttf.less']
        }),

        new CssCompressor({
            files: ['css/ttf.less'],
            compressOptions: {
                keepBreaks: false
            }
        }),

        new ModuleCompiler( {
            configFile: './module.conf'
        }),

        new JsCompressor({
            files: ['src/fonteditor/ttf/main.js']
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
                'src/math/*',
                'src/render/*',
                'src/render/*/*',
                'src/render/*/*/*',
                'src/ttf/*',
                'src/ttf/*/*',
                'src/ttf/*/*/*',
                'src/fonteditor/dialog/*',
                'src/fonteditor/widget/*'
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
    ".DS_Store"
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

