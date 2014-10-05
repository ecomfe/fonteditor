/**
 * @file svg2ttfobject.js
 * @author mengke01
 * @date 
 * @description
 * svg转ttfobject
 */

define(
    function(require) {

        var svg2ttfobject = require('ttf/svg2ttfobject');
        var ttf2base64 = require('ttf/ttf2base64');
        var TTFWriter = require('ttf/ttfwriter');

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                $.ajax({
                    url: '../font/iconfont.svg',
                    dataType: 'text'
                }).done(function(data) {

                    var ttfObject = svg2ttfobject(data);
                    var writer = new TTFWriter();

                    var ttfBuffer = writer.write(ttfObject);
                    var base64str = ttf2base64(ttfBuffer);

                    var saveBtn = $('.saveas');
                    saveBtn.attr('href', base64str);
                    saveBtn.attr('download', 'save.ttf');


                    console.log(ttfObject);
                });

            }
        };

        entry.init();
        
        return entry;
    }
);