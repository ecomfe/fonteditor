/**
 * @file ttfwriter.js
 * @author mengke01
 * @date 
 * @description
 * ttfwriter 入口
 */

define(
    function(require) {
        var TTFReader = require('ttf/ttfreader');
        var TTFWriter = require('ttf/ttfwriter');
        var ttf2base64 = require('ttf/ttf2base64');

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                $.getJSON('./data/iconfont.json', function(ttf) {

                    var reader = new TTFReader();
                    var writer = new TTFWriter();
                    var buffer = writer.write(ttf);

                    var ttfData = reader.read(buffer);

                    console.log(ttfData);

                    var base64str = ttf2base64(buffer);
                    var saveBtn = $('.saveas');
                    saveBtn.attr('href', base64str);
                    saveBtn.attr('download', 'save.ttf');
                });
            }
        };

        entry.init();
        
        return entry;
    }
);