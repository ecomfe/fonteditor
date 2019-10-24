/**
 * @file 编译首页文件，编译为中文版和英文版
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 字符串格式化，支持如 ${xxx.xxx} 的语法
 * @param {string} source 模板字符串
 * @param {Object} data 数据
 * @return {string} 格式化后字符串
 */
function format(source, data) {
    return source.replace(/\$\{([\w.]+)\}/g, function ($0, $1) {
        let ref = $1.split('.');
        let refObject = data;
        let level;

        while (refObject != null && (level = ref.shift())) {
            refObject = refObject[level];
        }

        return refObject != null ? refObject : '';
    });
}


module.exports = function main(tpl) {
    let language = String(this.resource).match(/\?en-us/) ? 'en-us' : 'zh-cn';
    let i18n = {};
    i18n.lang = require('./i18n.' + language);
    let fileContent = format(tpl, i18n);
    return 'module.exports=' + JSON.stringify(fileContent);
};
