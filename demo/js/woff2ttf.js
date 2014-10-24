/**
 * @file woff2ttf.js
 * @author mengke01
 * @date 
 * @description
 * woff 转ttf
 */

define(
    function(require) {
        var ajaxFile = require('common/ajaxFile');
        var woff2ttf = require('ttf/woff2ttf');
        var TTFReader = require('ttf/ttfreader');
        var inflate = require('inflate').inflate;
        var ttf2base64 = require('ttf/ttf2base64');

        function write() {

            ajaxFile({
                type: 'binary',
                url: '../font/iconfont.woff',
                onSuccess: function(buffer) {

                    var ttfBuffer = woff2ttf(buffer, {
                        inflate: inflate
                    });

                    var saveBtn = $('.saveas');
                    saveBtn.attr('href', ttf2base64(ttfBuffer));
                    saveBtn.attr('download', 'save.woff');

                    var ttfReader = new TTFReader();
                    var ttfData = ttfReader.read(ttfBuffer);
                    console.log(ttfData);
                },
                onError: function() {
                    console.error('error read file');
                }
            });
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                write();
            }
        };

        entry.init();
        
        return entry;
    }
);
