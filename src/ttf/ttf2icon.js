/**
 * @file ttf2icon.js
 * @author junmer
 * @description ttf转icon
 */

define(
    function (require) {

        var TTFReader = require('./ttfreader');
        var error = require('./error');

        /**
         * listUnicode
         *
         * @param  {Array} unicode unicode
         * @return {string}         unicode string
         */
        function listUnicode(unicode) {
            return unicode.map(function (u) {
                return '\\' + u.toString(16);
            }).join(',');
        }

        /**
         * ttf数据结构转icon数据结构
         *
         * @param {ttfObject} ttf ttfObject对象
         * @param {Object} options 选项
         * @param {Object} options.metadata 字体相关的信息
         * @param {Object} options.iconPrefix icon 前缀
         * @return {Object} icon obj
         */
        function ttfobject2icon(ttf, options) {

            var glyfList = [];

            // glyf 信息
            var filtered = ttf.glyf.filter(function (g) {
                return g.name !== '.notdef'
                    && g.name !== '.null'
                    && g.name !== 'nonmarkingreturn'
                    && g.unicode && g.unicode.length;
            });

            filtered.forEach(function (g) {
                glyfList.push({
                    code: '&#x' + g.unicode[0].toString(16) + ';',
                    codeName: listUnicode(g.unicode),
                    name: g.name
                });
            });

            return {
                fontFamily: ttf.name.fontFamily || 'fonteditor',
                iconPrefix: options.iconPrefix || 'icon',
                glyfList: glyfList
            };

        }


        /**
         * ttf格式转换成icon
         *
         * @param {ArrayBuffer|ttfObject} ttfBuffer ttf缓冲数组或者ttfObject对象
         * @param {Object} options 选项
         * @param {Object} options.metadata 字体相关的信息
         *
         * @return {Object} icon object
         */
        function ttf2icon(ttfBuffer, options) {

            options = options || {};

            // 读取ttf二进制流
            if (ttfBuffer instanceof ArrayBuffer) {
                var reader = new TTFReader();
                var ttfObject = reader.read(ttfBuffer);
                reader.dispose();

                return ttfobject2icon(ttfObject, options);
            }
            // 读取ttfObject
            else if (ttfBuffer.version && ttfBuffer.glyf) {

                return ttfobject2icon(ttfBuffer, options);
            }

            error.raise(10101);
        }

        return ttf2icon;
    }
);
