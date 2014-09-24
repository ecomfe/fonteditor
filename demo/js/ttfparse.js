/**
 * @file ttfparse.js
 * @author mengke01
 * @date 
 * @description
 * ttf解析函数入口
 */


define(
    function(require) {
        var ttfreader = require('ttf/ttfreader');
        var TTF = require('ttf/ttf');
        var ajaxBinaryFile = require('common/ajaxBinaryFile');

        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var ttf = new ttfreader().read(e.target.result);
            }

            reader.onerror = function(e) {
                console.error(e);
            };

            reader.readAsArrayBuffer(file);
        }

        var entry = {

            /**
             * 初始化
             */
            init: function() {
                var upFile = document.getElementById('upload-file');
                upFile.addEventListener('change', onUpFileChange);

                ajaxBinaryFile({
                    url: '../font/baiduHealth.ttf',
                    onSuccess: function(binaryData) {
                        var ttfReader = new ttfreader();
                        ttfReader.read(binaryData);
                        var ttfData = ttfReader.resolve();
                        console.log(ttfData);
                        
                        var ttf = new TTF(ttfData);

                    },
                    onError: function() {
                        console.error('error read file');
                    }
                });


            }
        };

        entry.init();

        return entry;
    }
);
