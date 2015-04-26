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
        var ajaxFile = require('common/ajaxFile');

        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {

                var ttfReader = new ttfreader({
                    hinting: true
                });
                var ttfData = ttfReader.read(e.target.result);
                console.log(ttfData);

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

                ajaxFile({
                    type: 'binary',
                    url: './test/baiduHealth.ttf',
                    onSuccess: function(binaryData) {
                        var ttfReader = new ttfreader({
                            hinting: true
                        });
                        var ttfData = ttfReader.read(binaryData);

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
