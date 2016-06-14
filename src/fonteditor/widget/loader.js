/**
 * @file 字体读取器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var font = require('fonteditor-core/ttf/font');
        var inflate = require('inflate');
        var loading = require('./loading');
        var program = require('./program');

        function svg2ttf(buffer) {
            var options = program.setting.get('ie').import;
            options.type = 'svg';
            return font.create(buffer, options).data;
        }

        function readttf(buffer, options) {
            // 暂不支持otf直接编辑，这里需要将otf转换成ttf
            if (options.type === 'woff') {
                options.inflate = inflate.inflate;
            }
            var ttf =  font.create(buffer, options).data;
            delete options.inflate;

            return ttf;
        }

        /**
         * 加载sfnt结构字体
         *
         * @param {File} file file对象
         * @param {Object} options 参数
         * @param {Object} options.type 文件类型
         * @param {Function} options.success 成功回调
         * @param {Function} options.error 失败回调
         */
        function loadSFNTFile(file, options) {
            loading.show();
            var fileReader = new FileReader();

            fileReader.onload = function (e) {
                try {
                    options.success && options.success(readttf(e.target.result, options));
                }
                catch (exp) {
                    alert(exp.message);
                    throw exp;
                }

                loading.hide();
            };

            fileReader.onerror = function (e) {
                loading.hide();
                fileReader = null;
                alert(i18n.lang.msg_error_read_file);
                options.error && options.error(e);
            };
            fileReader.readAsArrayBuffer(file);
        }


        /**
         * 加载sfnt结构字体
         *
         * @param {ArrayBuffer} buffer 二进制流
         * @param {Object} options 参数
         * @param {Object} options.type 文件类型
         * @param {Function} options.success 成功回调
         * @param {Function} options.error 失败回调
         */
        function loadSFNTBinary(buffer, options) {
            loading.show();

            try {
                options.success && options.success(readttf(buffer, options));
            }
            catch (exp) {
                alert(exp.message);
                throw exp;
            }

            loading.hide();
        }

        /**
         * 加载svg结构字体
         *
         * @param {File} file file对象
         * @param {Object} options 参数
         * @param {Function} options.success 成功回调
         * @param {Function} options.error 失败回调
         */
        function loadSVGFile(file, options) {

            loading.show();
            var fileReader = new FileReader();
            var fName = file.name.replace(/\.\w+$/, '');
            fileReader.onload = function (e) {
                try {
                    var buffer = e.target.result;
                    var imported = svg2ttf(buffer);
                    // 设置单个字形名字
                    if (imported.glyph && imported.glyph.length === 1) {
                        imported.glyph[0].name = fName;
                    }
                    fileReader = null;
                    options.success && options.success(imported);
                }
                catch (exp) {
                    alert(exp.message);
                    throw exp;
                }

                loading.hide();
            };

            fileReader.onerror = function (e) {
                loading.hide();
                fileReader = null;
                alert(i18n.lang.msg_error_read_file);
                options.error && options.error(e);
            };
            fileReader.readAsText(file);
        }

        /**
         * 加载svg结构字体
         *
         * @param {File} file svg文本
         * @param {Object} options 参数
         * @param {Function} options.success 成功回调
         * @param {Function} options.error 失败回调
         */
        function loadSVG(file, options) {
            loading.show();
            try {
                var imported = svg2ttf(file);
                loading.hide();
                options.success && options.success(imported);
            }
            catch (exp) {
                loading.hide();
                alert(exp.message);
                throw exp;
            }
        }

        var loader = {

            /**
             * 加载字体
             *
             * @param {File} file file对象
             * @param {Object} options 参数
             * @param {Object} options.type 文件类型
             * @param {Function} options.success 成功回调
             * @param {Function} options.error 失败回调
             */
            load: function (file, options) {
                if (options.type === 'svg') {
                    if (typeof file === 'string' || file instanceof window.XMLDocument) {
                        loadSVG(file, options);
                    }
                    else {
                        loadSVGFile(file, options);
                    }
                }
                else if (
                    options.type === 'ttf'
                    || options.type === 'woff'
                    || options.type === 'eot'
                    || options.type === 'otf'
                ) {
                    if (file instanceof ArrayBuffer) {
                        loadSFNTBinary(file, options);
                    }
                    else {
                        loadSFNTFile(file, options);
                    }
                }
                else {
                    options.error && options.error({
                        message: i18n.lang.msg_not_support_file_type
                    });
                }
            },

            /**
             * 支持的加载类型
             *
             * @param {string} fileName 文件类型
             * @return {boolean}
             */
            supportLoad: function (fileName) {
                return !!fileName.match(/(\.ttf|\.woff|\.eot|\.otf)$/i);
            },

            /**
             * 支持的导入类型
             *
             * @param {string} fileName 文件类型
             * @return {boolean}
             */
            supportImport: function (fileName) {
                return !!fileName.match(/(\.ttf|\.woff|\.svg|\.eot|\.otf)$/i);
            }
        };

        return loader;
    }
);
