/**
 * @file 预览组件
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var resolvettf = require('./util/resolvettf');
        var ttf2icon = require('fonteditor-core/ttf/ttf2icon');
        var font = require('fonteditor-core/ttf/font');

        var previewRender = require('../template/preview-render'); // 模板渲染函数
        var extend = require('common/lang').extend;
        var isIE = !!window.ActiveXObject || 'ActiveXObject' in window;

        /**
         * 生成预览模板
         *
         * @param {Object} ttf ttfObject
         * @param {string} fontFormat 字体类型
         * @return {string} html字符串
         */
        function generatePreviewHTML(ttf, fontFormat) {
            var options = {
                type: fontFormat || 'ttf'
            };

            ttf = resolvettf(ttf);
            var fontData = font.create(ttf).toBase64(options);
            var data = extend(
                {
                    fontData: fontData,
                    fontFormat: options.type
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
                    alert(exp.message);
                    throw exp;
                }
            }
        };

        return previewer;
    }
);
