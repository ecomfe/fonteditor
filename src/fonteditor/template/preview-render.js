/**
 * @file 预览渲染器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var utpl = require('utpl');
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
                previewRender = previewRender || utpl.template(require('./preview-ttf.tpl'));
                return previewRender(data);
            }
        };

        return render;
    }
);
