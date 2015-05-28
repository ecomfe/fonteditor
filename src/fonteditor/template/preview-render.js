/**
 * @file 预览渲染器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var string = require('common/string');
        var i18n = require('../i18n/i18n');
        var utpl = require('utpl');
        var exportRender = require('./export-render');
        var previewRender = null; // 预览渲染器

        var render = {

            /**
             * 渲染预览页面
             *
             * @param  {Object} data 预览页渲染数据
             * @param  {Object} data.fontData 字体数据
             * @param  {Object} data.fontFormat 字体格式
             *
             * @return {string}          html片段
             */
            renderPreview: function (data) {
                data.previewCss = exportRender.renderPreviewCss();
                var tpl = string.format(require('./export/preview-ttf.tpl'), i18n);
                previewRender = previewRender || utpl.template(tpl);
                return previewRender(data);
            }
        };

        return render;
    }
);
