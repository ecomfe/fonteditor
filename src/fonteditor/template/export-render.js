/**
 * @file html渲染器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var utpl = require('utpl');

        var fontExampleRender = null; // 图标示例渲染器
        var fontCssRender = null; // 图标css渲染器
        var tplPreviewCss = null; // 预览css样式


        $.get('./css/preview.css', function (text) {
            tplPreviewCss = text;
        });

        var render = {

            /**
             * 渲染图标示例
             *
             * @param  {Object} iconData 图标数据
             * @return {string}          html片段
             */
            renderFontExample: function (iconData) {
                fontExampleRender = fontExampleRender || utpl.template(require('./export/icon-example.tpl'));
                return fontExampleRender(iconData);
            },


            /**
             * 渲染图标css
             *
             * @param  {Object} iconData 图标数据
             * @return {string}          html片段
             */
            renderFontCss: function (iconData) {
                fontCssRender = fontCssRender || utpl.template(require('./export/icon-css.tpl'));
                return fontCssRender(iconData);
            },

            /**
             * 渲染预览css
             *
             * @return {string} html片段
             */
            renderPreviewCss: function () {
                return tplPreviewCss;
            }
        };

        return render;
    }
);
