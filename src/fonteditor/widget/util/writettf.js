/**
 * @file 根据选项生成ttf
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var TTFWriter = require('fonteditor-core/ttf/ttfwriter');
        var program = require('../program');

        /**
         * 写ttf buffer
         * @param  {Object} ttfObject ttf对象
         * @param  {Object} options   参数选项
         * @return {ArrayBuffer}      数据缓冲
         */
        function writeTTF(ttfObject, options) {
            options = options || {};

            var exportSetting = program.setting.get('ie');
            // 强制设置post表信息
            ttfObject.post = ttfObject.post || {};
            if (exportSetting && exportSetting.export.saveWithGlyfName) {
                ttfObject.post.format = 2;
            }
            else {
                ttfObject.post.format = 3;
            }

            return new TTFWriter().write(ttfObject);
        }

        return writeTTF;
    }
);
