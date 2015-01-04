/**
 * @file exporter.js
 * @author mengke01
 * @date
 * @description
 * 导出器
 */


define(
    function (require) {

        var TTFWriter = require('ttf/ttfwriter');
        var ttf2woff = require('ttf/ttf2woff');
        var ttf2eot = require('ttf/ttf2eot');
        var ttf2svg = require('ttf/ttf2svg');
        var bytes2base64 = require('ttf/util/bytes2base64');
        var deflate = require('deflate');
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
         * @return {Binary} base64 font file
         */
        function font2buffer(ttf, options) {
            var buffer = null;
            if (options.type === 'woff') {
                buffer = ttf2woff(new TTFWriter().write(ttf), deflate);
            }
            else if (options.type === 'eot') {
                buffer = ttf2eot(new TTFWriter().write(ttf));
            }
            else if (options.type === 'svg') {
                buffer = ttf2svg(ttf);
            }
            else {
                buffer = new TTFWriter().write(ttf);
                options.type = 'ttf';
            }

            return buffer;
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
                        var fontzip = zip.folder('fonteditor');

                        ['woff', 'eot', 'svg', 'ttf'].forEach(function (fileType) {

                            fontzip.file(
                                fileName + '.' + fileType,
                                font2buffer(ttf, {
                                    type: fileType
                                })
                            );

                        });

                        base64Str = 'data:application/zip;base64,' + zip.generate({
                            type: 'base64'
                        });

                    }
                    else {
                        var buffer = font2buffer(ttf, options);
                        if (options.type === 'svg') {
                            base64Str = btoa(buffer);
                        }
                        else {
                            base64Str = bytes2base64(buffer);
                        }

                        base64Str = 'data:font/'
                            + options.type
                            + ';charset=utf-8;base64,'
                            + base64Str;
                    }

                    var target = $(options.target);
                    target.attr('download', fileName + '.' + options.type);

                    target.attr('href', base64Str);
                    if (options.success) {
                        options.success(base64Str);
                    }

                }
                catch (e) {
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
            'export': exportFile
        };
        return exporter;
    }
);
