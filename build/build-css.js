/**
 * @file 单独编译css文件
 * @author mengke01(kekee000@gmail.com)
 */

var path = require('path');
var fs = require('fs');
var less = require('less');
var BASE_DIR = process.cwd();

// 默认的文件列表
var DEFAULT_FILES = [
    'css/main.less',
    'css/preview.less'
];


main(process.argv.slice(2));

function main(fileList) {
    var list = fileList.length ? fileList : DEFAULT_FILES;
    list.forEach(function (filePath) {
        filePath = path.resolve(BASE_DIR, filePath);
        less2css(filePath);
    });
}


function compileLess(code, options, onsuccess) {
    less.render(code, options).then(function (output) {
        onsuccess(output.css);
    }, function (error) {
        throw error;
    });
}

function less2css(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error('file not exist:' + filePath);
    }
    var paths = [
        __dirname
    ];
    var options = {
        relativeUrls: true,
        compress: true,
        paths: paths,
        filename: filePath
    };
    compileLess(fs.readFileSync(filePath, 'utf-8'), options, function (code) {
        fs.writeFileSync(filePath.replace(/\.less$/, '.css'), code);
        console.log('build less success:' + filePath);
    });
}
