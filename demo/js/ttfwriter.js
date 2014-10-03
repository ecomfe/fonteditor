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
                $.getJSON('./js/iconfont.json', function(ttf) {

                    var reader = new TTFReader();
                    var writer = new TTFWriter();
                    var buffer = writer.write(ttf);

                    reader.read(buffer);
                    var ttfData = reader.resolve();
                    console.log(ttfData);

                    var base64str = 'data:font/ttf;charset=utf-8;base64,' + ttf2base64(buffer);
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