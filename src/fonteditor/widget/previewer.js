/**
 * @file previewer.js
 * @author mengke01
 * @date
 * @description
 * 预览组件
 */


define(
    function (require) {

        var TTFWriter = require('ttf/ttfwriter');
        var ttf2woff = require('ttf/ttf2woff');
        var ttf2eot = require('ttf/ttf2eot');
        var ttf2svg = require('ttf/ttf2svg');
        var ttf2base64 = require('ttf/ttf2base64');
        var woff2base64 = require('ttf/woff2base64');
        var eot2base64 = require('ttf/eot2base64');
        var svg2base64 = require('ttf/svg2base64');
        var extend = require('common/lang').extend;
        var ttf2icon = require('ttf/ttf2icon');

        var previewRender = require('../template/preview-render'); // 模板渲染函数

        var isIE = !!window.ActiveXObject || 'ActiveXObject' in window;

        /**
         * 生成预览模板
         *
         * @param {Object} ttf ttfObject
         * @param {string} fontFormat 字体类型
         * @return {string} html字符串
         */
        function generatePreviewHTML(ttf, fontFormat) {
            fontFormat = fontFormat || ttf;

            var fontData = '';
            var buffer;

            if (fontFormat === 'woff') {
                buffer = new TTFWriter().write(ttf);
                fontData = woff2base64(ttf2woff(buffer));
            }
            else if (fontFormat === 'eot') {
                buffer = new TTFWriter().write(ttf);
                fontData = eot2base64(ttf2eot(buffer));
            }
            else  if (fontFormat === 'svg') {
                fontData = svg2base64(ttf2svg(ttf));
            }
            else {
                buffer = new TTFWriter().write(ttf);
                fontData = ttf2base64(buffer);
            }

            var data = extend(
                {
                    fontData: fontData,
                    fontFormat: fontFormat
                },
                ttf2icon(ttf)
            );

            return previewRender.renderPreview(data);
        }


        var previewer = {

            /**
             * 加载预览按钮
             *
             * @param {Object} ttf ttfObject
             * @param {string} fontFormat 字体类型
             */
            load: function (ttf, fontFormat) {
                try {
                    var html = generatePreviewHTML(ttf, fontFormat);
                    var win = window.open('./empty.html');
                    if (isIE && win.document && win.document.body) {
                        win.document.body.innerHTML = html;
                        win.focus();
                    }
                    else {
                        win.onload = function () {
                            win.document.body.innerHTML = html;
                            win.focus();
                            win = null;
                            html = null;
                        };
                    }
                }
                catch (exp) {
                    throw exp;
                    //alert(exp.message);
                }
            }
        };

        return previewer;
    }
);
