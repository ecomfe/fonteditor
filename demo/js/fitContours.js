/**
 * @file 寻找关键点
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var fitBezier = require('graphics/image/fitBezier');
        var findBreakPoints = require('graphics/image/findBreakPoints');
        var pathUtil = require('graphics/pathUtil');
        var data = require('demo/../data/image-contours3');
        var drawPath = require('render/util/drawPath');



        function fitContour(data) {

            data = pathUtil.scale(data, 10);
            var breakPoints = findBreakPoints(data);
            var resultContour = [];
            for (var i = 0, l = breakPoints.length; i < l; i++) {
                var start = breakPoints[i];
                var end = breakPoints[i < l - 1 ? i + 1 : 0];
                resultContour.push({
                    x: start.x,
                    y: start.y,
                    onCurve: true
                });

                if (start.right !== 1) {
                    var curvePoints = data.slice(start.index, end.index + 1);
                    if (curvePoints.length > 6) {
                        var bezierCurve = fitBezier(curvePoints, 10);
                        if (bezierCurve.length) {
                            bezierCurve.forEach(function (p) {
                                resultContour.push(p);
                            });
                        }
                    }
                }
            }

            resultContour = pathUtil.scale(resultContour, 0.1);
            data = pathUtil.scale(data, 0.1);

            return resultContour;
        }


        var entry = {

            /**
             * 初始化
             */
            init: function () {

                var html = '';
                var contours = [];
                data.forEach(function(contour) {
                    contour.forEach(function (p) {
                        html += '<i style="left:'+p.x+'px;top:'+p.y+'px;"></i>';
                    });

                    contours.push(fitContour(contour));
                });

                var ctx = $('#canvas').get(0).getContext('2d');
                ctx.fillStyle = 'cyan';

                contours.forEach(function (contour) {
                    for (var i = 0, l = contour.length; i < l; i++) {
                        html += '<i style="left:'+contour[i].x+'px;top:'+contour[i].y+'px;" class="break"></i>';
                    }
                    drawPath(ctx, contour);
                });

                ctx.stroke();

                $('#points').html(html);
            }
        };

        entry.init();

        return entry;
    }
);
