/**
 * @file 寻找关键点
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var findBreakPoints = require('graphics/image/findBreakPoints');
        var pathUtil = require('graphics/pathUtil');
        var data = require('demo/../data/image-contour4');

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

                var ctx = $('#canvas').get(0).getContext('2d');
                ctx.strokeColor = 'red';

                for (var i = 0, l = breakPoints.length; i < l; i++) {
                    var start = breakPoints[i];
                    var end = breakPoints[i < l - 1 ? i + 1 : 0];
                    if (start.right == 1) {
                        ctx.moveTo(start.x, start.y);
                        ctx.lineTo(end.x, end.y);
                    }

                    html += '<i style="left:'+start.x+'px;top:'+start.y+'px;" class="break"></i>';
                }

                ctx.stroke();

                $('#points').html(html);
            }
        };

        entry.init();

        return entry;
    }
);
