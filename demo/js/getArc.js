/**
 * @file getArc.js
 * @author mengke01
 * @date 
 * @description
 * svg转ttfobject
 */

define(
    function(require) {

        var svg2contours = require('ttf/util/svg2contours');
        var contour2svg = require('ttf/util/contour2svg');
        var getArc = require('graphics/getArc');
        var entry = {

            /**
             * 初始化
             */
            init: function () {

                // 300,200 A150,50 0 1,0 450,50
                var path = getArc(150, 100, 0, 1, 1, {x: 300, y:200}, {x:300, y:300});


                $('#path').attr('d', contour2svg(path));
            }
        };

        entry.init();
        
        return entry;
    }
);