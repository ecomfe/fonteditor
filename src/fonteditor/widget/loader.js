/**
 * @file 字体读取器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var TTFReader = require('ttf/ttfreader');
        var woff2ttf = require('ttf/woff2ttf');
        var eot2ttf = require('ttf/eot2ttf');
        var svg2ttfobject = require('ttf/svg2ttfobject');
        var otf2ttfobject = require('ttf/otf2ttfobject');
        var inflate = require('inflate');
        var loading = require('./loading');
        var program = require('./program');

        var woffOptions = {
            inflate: inflate.inflate
        };

        function svg2ttf(buffer) {
            var ieOpt = program.setting.get('ie');
            return svg2ttfobject(buffer, ieOpt.import);
        }

        function getttf(buffer, options) {
            var ttf;
            // 暂不支持otf直接编辑，这里需要将otf转换成ttf
            if (options.type === 'otf') {
                ttf = otf2ttfobject(buffer);
            }
            else {

                if (options.type === 'woff') {
                    buffer = woff2ttf(buffer, woffOptions);
                }
                else if (options.type === 'eot') {
                    buffer = eot2ttf(buffer);
                }

                var ttfReader = new TTFReader();
                ttf = ttfReader.read(buffer);
                ttfReader.dispose();
            }

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
                    options.success && options.success(getttf(e.target.result, options));
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
                alert('读取文件出错!');
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
                options.success && options.success(getttf(buffer, options));
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

            fileReader.onload = function (e) {
                try {
                    var buffer = e.target.result;
                    var imported = svg2ttf(buffer);
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
                alert('读取文件出错!');
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
                        message: '不支持的文件类型'
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
