/**
 * @file previewer.js
 * @author mengke01
 * @date 
 * @description
 * 预览组件
 */


define(
    function(require) {

        var TTFWriter = require('ttf/ttfwriter');
        var ttf2woff = require('ttf/ttf2woff');
        var ttf2svg = require('ttf/ttf2svg');
        var ttf2base64 = require('ttf/ttf2base64');
        var woff2base64 = require('ttf/woff2base64');
        var svg2base64 = require('ttf/svg2base64');
        var utpl = require('utpl');

        var previewTplRender = null; // 模板渲染函数

        /**
         * unicode2html编码
         * 
         * @param {number} u unicode码
         * @return {string} html编码
         */
        function unicode2html(u) {
            return '&amp;#x' + u.toString(16) + ';';
        }

        /**
         * 生成预览模板
         * 
         * @param {Object} ttf ttfObject
         * @param {string} fontFormat 字体类型
         * @return {string} html字符串
         */
        function generatePreviewHTML(ttf, fontFormat) {
            fontFormat = !fontFormat || fontFormat == 'ttf' ? 'truetype' : fontFormat;

            var fontData = '';
            var fontFamily = ttf.name.fontFamily || 'fonteditor';
            var glyfList = [];

            if (fontFormat == 'woff') {
                var buffer = new TTFWriter().write(ttf);
                fontData = woff2base64(ttf2woff(buffer));
            }
            else  if (fontFormat == 'svg') {
                fontData = svg2base64(ttf2svg(ttf));
            }
            else {
                var buffer = new TTFWriter().write(ttf);
                fontData = ttf2base64(buffer);
            }


            // 过滤不显示的字形
            var filtered = ttf.glyf.filter(function(g) {
                return g.name != '.notdef' && g.name != '.null' && g.name != 'nonmarkingreturn' 
                    && g.unicode && g.unicode.length;
            });

            filtered.forEach(function(g) {
                glyfList.push({
                    code: '&#x' + g.unicode[0].toString(16) + ';',
                    codeName: g.unicode.map(unicode2html).join(',')
                });
            });

            return previewTplRender({
                fontData: fontData,
                fontFormat: fontFormat,
                fontFamily: fontFamily,
                glyfList: glyfList
            });
        }


        var previewer = {

            /**
             * 初始化
             */
            init: function() {
                if (!previewTplRender) {
                    $.get('./template/preview-ttf.html', function(text) {
                        previewTplRender = utpl.template(text);
                    });
                }
            },

            /**
             * 加载预览按钮
             * 
             * @param {Object} ttf ttfObject
             * @param {string} fontFormat 字体类型
             */
            load: function(ttf, fontFormat) {
                var html = generatePreviewHTML(ttf, fontFormat);
                var win = window.open('./empty.html');
                win.onload = function() {
                    win.document.body.innerHTML = html;
                    win.focus();
                    win = null;
                    html = null;
                };
            }
        };

        previewer.init();

        return previewer;
    }
);
