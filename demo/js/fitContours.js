/**
 * @file 寻找关键点
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var fitBezier = require('graphics/image/fitBezier');
        var findBreakPoints = require('graphics/image/findBreakPoints');
        var pathUtil = require('graphics/pathUtil');
        var vector = require('graphics/vector');
        var data = require('demo/../data/image-contours1');
        var drawPath = require('render/util/drawPath');

        function fitContour(data) {

            data = pathUtil.scale(data, 10);
            var breakPoints = findBreakPoints(data);

            breakPoints.forEach(function (p) {
                console.log(p.right);
            });

            var resultContour = [];
            var isLast;
            var start;
            var end;
            var lasttHat;
            for (var i = 0, l = breakPoints.length; i < l; i++) {
                isLast = i === l - 1;
                start = breakPoints[i];
                end = breakPoints[ isLast ? 0 : i + 1];

                resultContour.push({
                    x: start.x,
                    y: start.y,
                    onCurve: true
                });

                if (start.right !== 1) {

                    if (isLast) {
                        var curvePoints = data.slice(start.index).concat(data.slice(0, end.index + 1));
                    }
                    else {
                        var curvePoints = data.slice(start.index, end.index + 1);
                    }

                    var bezierCurvePoints = [];
                    var curvePointsLast = curvePoints.length - 1;
                    if (curvePoints.length > 60) {
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return index === 0 || index === curvePointsLast || p.index % 6 === 0;
                        });
                    }
                    else if (curvePoints.length > 30) {
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return  index === 0 || index === curvePointsLast || p.index % 3 === 0;
                        });
                    }
                    else {
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return  index === 0 || index === curvePointsLast || p.index % 2 === 0;
                        });
                    }

                    ///console.log(bezierCurvePoints.length);
                    var bezierCurve = fitBezier(bezierCurvePoints, 10, lasttHat);
                    if (bezierCurve.length) {
                        bezierCurve.forEach(function (p) {
                            resultContour.push(p);
                        });
                        end = bezierCurve[bezierCurve.length - 1];
                        end.tangency = true;
                    }
                }

                if (end.tangency || end.inflexion) {
                    lasttHat = vector.normalize({
                        x: end.x - start.x,
                        y: end.y - start.y
                    });
                }
                else {
                    lasttHat = null;
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
