/**
 * @file 测试模块转换
 * @author mengke01(kekee000@gmail.com)
 */
var fs = require('fs');
var amd2module = require('./amd2module');

function main() {
    var code = fs.readFileSync('../src/ttf/error.js');
    fs.writeFileSync('./generated.js', amd2module(code, '../'));
}

main();
