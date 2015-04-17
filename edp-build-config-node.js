var path = require( 'path' );
var amd2module = require('./node/amd2module');

exports.input =  path.resolve(__dirname, './src');;
exports.output = path.resolve(__dirname, '../fonteditor-ttf/lib');


exports.getProcessors = function () {

    var NodeModuleProcessor = {
        name: 'NodeModuleProcessor',
        files: [
            'common/lang.js',
            'common/string.js',
            'common/observable.js',
            'common/DOMParser.js',
            'math/**/*.js',
            'graphics/**/*.js',
            'ttf/**/*.js'
        ],
        process: function(file, processContext, callback) {

            var depth = new Array(file.path.split('/').length).join('../');

            if (file.data.indexOf('define') >= 0) {
                file.setData(amd2module(file.data, depth));
            }
            callback();
        }
    }

    return [
        NodeModuleProcessor,
        // 清除冗余文件，比如`less`
        new OutputCleaner({
            files: [
                'common/ajaxFile.js',
                'common/DataStore.js',
                'common/observable.js',
                'common/promise.js',
                'common/getPixelRatio.js',
                'editor/**',
                'fonteditor/**',
                'render/**',
                'template/**'
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
    "test",
    "unittest",
    "edp-*",
    "output",
    ".DS_Store",
    ".gitignore",
    "package.json",
    "node"
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

