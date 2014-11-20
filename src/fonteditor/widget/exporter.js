/**
 * @file exporter.js
 * @author mengke01
 * @date
 * @description
 * 导出器
 */


define(
    function(require) {

        var TTFWriter = require('ttf/ttfwriter');
        var deflate = require('deflate');
        var ttf2woff = require('ttf/ttf2woff');
        var ttf2eot = require('ttf/ttf2eot');
        var ttf2svg = require('ttf/ttf2svg');
        var ttf2base64 = require('ttf/ttf2base64');
        var woff2base64 = require('ttf/woff2base64');
        var eot2base64 = require('ttf/eot2base64');
        var svg2base64 = require('ttf/svg2base64');
        var JSZip = require('JSZip');

        /**
         * 导出SFNT结构字体 base64
         *
         * @inner
         *
         * @param {Object} ttf ttf字体结构
         * @param {Object} options 参数
         * @param {Object} options.type 文件类型
         *
         * @return {String} base64ed font
         */
        function font2base64(ttf, options) {

            var base64Str = '';
            var buffer = null;
            if (options.type === 'woff') {
                buffer = ttf2woff(new TTFWriter().write(ttf), deflate);
                base64Str = woff2base64(buffer);
            }
            else if (options.type === 'eot') {
                buffer = ttf2eot(new TTFWriter().write(ttf));
                base64Str = eot2base64(buffer);
            }
            else if(options.type === 'svg') {
                base64Str = svg2base64(ttf2svg(ttf));
            }
            else {
                buffer = new TTFWriter().write(ttf);
                base64Str = ttf2base64(buffer);
                options.type = 'ttf';
            }

            return base64Str;
        }

        /**
         * 导出SFNT结构字体
         *
         * @param {Object} ttf ttf字体结构
         * @param {Object} options 参数
         * @param {Object} options.type 文件类型
         * @param {Object} options.fileName 文件名
         * @param {Function} options.success 成功回调
         * @param {Function} options.error 失败回调
         *
         * @return {HTMLElement} 导出按钮
         */
        function exportFile(ttf, options) {

            if (ttf) {
                try {

                    var base64Str = '';
                    var fileName = (options.fileName || ttf.name.fontFamily || 'export');

                    // 导出
                    if (options.type === 'zip') {

                        var zip = new JSZip();
                        var fontzip = zip.folder('font');

                        ['woff', 'eot', 'svg', 'ttf'].forEach(function(fileType) {

                            fontzip.file(
                                fileName + '.' + fileType,
                                font2base64(ttf, {
                                    type: fileType
                                }).split('base64,')[1],
                                {
                                    base64: true
                                }
                            );

                        });

                        base64Str = 'data:application/zip;base64,' + zip.generate({
                            type: 'base64'
                        });

                    }
                    else {
                        base64Str = font2base64.apply(this, arguments);
                    }

                    var target = $(options.target);
                    target.attr('download', fileName + '.' + options.type);

                    target.attr('href', base64Str);
                    if (options.success) {
                        options.success(base64Str);
                    }

                } catch (e) {
                    $(options.target).removeAttr('download');
                    alert(e.message);
                    if (options.error) {
                        options.error(e);
                    }
                }
            }

            return options.target;
        }


        var exporter = {

            /**
             * 导出SFNT结构字体
             *
             * @param {Object} ttf ttf字体结构
             * @param {Object} options 参数
             * @param {Object} options.type 文件类型
             * @param {Object} options.fileName 文件名
             * @param {Function} options.success 成功回调
             * @param {Function} options.error 失败回调
             *
             * @return {HTMLElement} 导出按钮
             */
            'export': exportFile
        };
        return exporter;
    }
);
