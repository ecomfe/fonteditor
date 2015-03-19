/**
 * @file 寻找关键点
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var fitBezier = require('graphics/image/fitBezier');
        var findBreakPoints = require('graphics/image/findBreakPoints');
        var pathUtil = require('graphics/pathUtil');
        var data = require('demo/../data/image-contour4');
        var drawPath = require('render/util/drawPath');

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                data = pathUtil.scale(data, 10);

                var breakPoints = findBreakPoints(data);

                data = pathUtil.scale(data, 0.1);

                var html = '';
                data.forEach(function(p) {
                    html += '<i style="left:'+p.x+'px;top:'+p.y+'px;"></i>';
                });


                for (var i = 0, l = breakPoints.length; i < l; i++) {
                    html += '<i style="left:'+breakPoints[i].x+'px;top:'+breakPoints[i].y+'px;" class="break"></i>';
                }

                var ctx = $('#canvas').get(0).getContext('2d');
                ctx.strokeColor = 'red';

                ctx.stroke();

                $('#points').html(html);
            }
        };

        entry.init();

        return entry;
    }
);
