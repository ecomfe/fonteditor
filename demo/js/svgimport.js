/**
 * @file svgimport.js
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
                    url: '../test/iconfont-chunvzuo.svg',
                    dataType: 'text'
                }).done(function(data) {

                    var ttfObject = svg2ttfobject(data);
                    console.log(ttfObject);
                });

            }
        };

        entry.init();
        
        return entry;
    }
);