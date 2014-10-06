/**
 * @file loader.js
 * @author mengke01
 * @date 
 * @description
 * 加载器
 */


define(
    function(require) {

        var TTFReader = require('ttf/ttfreader');
        var woff2ttf = require('ttf/woff2ttf');
        var svg2ttfobject = require('ttf/svg2ttfobject');
        
        var loading = require('./loading');

        var woffOptions = {
            inflate: require('inflate').inflate
        };


        /**
         * 加载sfnt结构字体
         * 
         * @param {File} file file对象
         * @param {Object} options 参数
         * @param {Object} options.type 文件类型
         * @param {Function} options.success 成功回调
         * @param {Function} options.error 失败回调
         */
        function loadSFNT(file, options) {
            loading.show();
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                var buffer = e.target.result;

                if (options.type == 'woff') {
                    buffer = woff2ttf(buffer, woffOptions);
                }

                var ttfReader = new TTFReader();
                var ttf = ttfReader.read(buffer);
                ttfReader.dispose();
                fileReader = null;
                loading.hide();
                options.success && options.success(ttf);
            }

            fileReader.onerror = function(e) {
                loading.hide();
                fileReader = null;
                alert('读取文件出错!');
                options.error && options.error(e);
            };
            fileReader.readAsArrayBuffer(file);
        }

        /**
         * 加载svg结构字体
         * 
         * @param {File} file file对象
         * @param {Object} options 参数
         * @param {Function} options.success 成功回调
         * @param {Function} options.error 失败回调
         */
         function loadSVG(file, options) {

            loading.show();
            var fileReader = new FileReader();

            fileReader.onload = function(e) {
                var buffer = e.target.result;
                var imported = svg2ttfobject(buffer);
                fileReader = null;
                loading.hide();
                options.success && options.success(imported);
            };

            fileReader.onerror = function(e) {
                loading.hide();
                fileReader = null;
                alert('读取文件出错!');
                options.error && options.error(e);
            };
            fileReader.readAsText(file);
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
            load: function(file, options) {
                if (options.type == 'svg') {
                    loadSVG(file, options);
                }
                else if (options.type == 'ttf' || options.type == 'woff'){
                    loadSFNT(file, options);
                }
                else {
                    options.error && options.error({
                        message: '不支持的文件类型'
                    });
                }
            }
        };

        return loader;
    }
);
