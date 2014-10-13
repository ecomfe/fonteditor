/**
 * @file string.js
 * @author mengke01
 * @date 
 * @description
 * string 相关的函数
 */

define(
    function(require) {
        var string = {

            /**
             * HTML解码字符串
             * 
             * @param {string} source 源字符串
             * @return {string}
             */
            decodeHTML: function(source) {
                var str = String(source)
                    .replace(/&quot;/g, '"')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&');

                //处理转义的中文和实体字符
                return str.replace(/&#([\d]+);/g, function(_0, _1){
                    return String.fromCharCode(parseInt(_1, 10));
                });
            },

            /**
             * HTML编码字符串
             * 
             * @param {string} source 源字符串
             * @return {string}
             */
            encodeHTML: function(source) {
                return String(source)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            },

            /**
             * 获取string字节长度
             * 
             * @param {string} source 源字符串
             * @return {number} 长度
             */
            getLength: function(source) {
                return String(source).replace(/[^\x00-\xff]/g, '11').length;
            },

            /**
             * 按字节截取字符串
             * @param {string} str 字符串
             * @param {number} length 截取长度
             * @param {string} tail 加的后缀
             * @return {string} 截取后的字符串
             */
            cut: function(str, length, tail) {
                tail = tail || '';
                str = String(str);
                var size = 0;
                var l = str.length;

                for(var i = 0; i < l; i++) {
                    size += str.charCodeAt(i) > 255 ? 2 : 1;
                    if(size > length) {
                        return str.slice(0, i) + tail;
                    }
                }
                return str + tail;
            },

            /**
             * 字符串格式化，支持如 ${xxx.xxx} 的语法
             * @param {string} tmpl 模板字符串
             * @param {Object} data 数据
             * @return {string} 格式化后字符串
             */
            format: function(source, data) {
                return source.replace(/\$\{([\w.]+)\}/g, function($0, $1) {
                    var ref = $1.split('.');
                    var refObject = data, level;
                    while( refObject != null && (level = ref.shift()) ) {
                        refObject = refObject[level];
                    }
                    return refObject != null ?  refObject : '';
                });
            },

            /**
             * 使用指定字符填充字符串,默认`0`
             * 
             * @param {string} str 字符串
             * @param {number} size 填充到的大小
             * @param {string=} ch 填充字符
             * @return {string} 字符串
             */
            pad: function(str, size, ch) {
                str = String(str);
                if(str.length > size) {
                    return str.slice(str.length - size);
                }
                return new Array(size - str.length + 1).join(ch || '0') + str;
            }
        };

        return string;
    }
);
