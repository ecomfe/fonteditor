var path = require( 'path' );

exports.input = __dirname;
exports.output = path.resolve(__dirname, './release');


exports.getProcessors = function () {


    return [
        new LessCompiler({
            files: [
                'css/main.less',
                'css/editor.less',
                'css/preview.less'
            ],
            entryFiles: []
        }),


        new Html2JsCompiler({
            mode: 'default',
            files: ['src/fonteditor/template/**/*.tpl'],
            extnames: ['tpl'],
            afterAll: function (context) {
                this.processFiles.forEach(function (file) {
                    require('fs').writeFileSync(file.path + '.js', file.data);
                });
            }
        }),

        new ModuleCompiler( {
            files: [
                'src/fonteditor/main.js',
                'src/fonteditor/editor.js'
            ],
            configFile: './module.conf'
        }),


        new JsCompressor({
            files: [
                'src/fonteditor/main.js',
                'src/fonteditor/editor.js',
                'dep/**/*.js',
                '!dep/**/*.min.js',
            ]
        }),

        // 清除冗余文件，比如`less`
        new OutputCleaner({
            files: [
                'css/common/**',
                'src/common/**',
                'src/editor/**',
                'src/graphics/**',
                'src/math/**',
                'src/render/**',
                'src/fonteditor/*/**',
                'dep/fonteditor-core/**',
                '*.tpl'
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
    "agent",
    "mock",
    "test",
    "unittest",
    "edp-*",
    "output",
    ".DS_Store",
    ".gitignore",
    ".fecs*",
    "package.json",
    "node",
    "node_modules",
    "release",
    "build"
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

