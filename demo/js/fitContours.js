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


        var bezierCurvePointsArray = [];

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
            var tHat1Point;
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
                        var curvePoints = data.slice(start.index).concat(data.slice(0, end.index));
                    }
                    else {
                        var curvePoints = data.slice(start.index, end.index + 1);
                    }

                    var bezierCurvePoints = [];
                    var curvePointsLast = curvePoints.length - 1;

                    if (curvePoints.length > 200) {
                        var derive = Math.floor(curvePoints.length / 10);
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return index === 0 || index === curvePointsLast || p.index % derive === 0;
                        });
                    }
                    else if (curvePoints.length > 30) {
                        var derive = Math.floor(curvePoints.length / 5);
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return  index === 0 || index === curvePointsLast || p.index % derive === 0;
                        });
                    }
                    else {
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return  index === 0 || index === curvePointsLast || p.index % 5 === 0;
                        });
                    }

                    if ((start.tangency || start.inflexion) && tHat1Point) {
                        tHat1 = vector.normalize({
                            x: start.x - tHat1Point.x,
                            y: start.y - tHat1Point.y
                        });
                    }
                    else {
                        tHat1 = null;
                    }

                    bezierCurvePoints.forEach(function (p) {
                        bezierCurvePointsArray.push(p);
                    });

                    var bezierCurve = fitBezier(bezierCurvePoints, 10, tHat1);
                    if (bezierCurve.length) {
                        bezierCurve.forEach(function (p) {
                            resultContour.push(p);
                        });
                        tHat1Point = bezierCurve[bezierCurve.length - 2];
                    }
                    else {
                        tHat1Point = null;
                    }
                }
                else {
                    tHat1Point = start;
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

                    contour.splice(contour.length - 1, 1);

                    contour.forEach(function (p) {
                        html += '<i style="left:'+p.x+'px;top:'+p.y+'px;"></i>';
                    });

                    contours.push(fitContour(contour));
                });


                $('#points').html(html);

                html = '';
                bezierCurvePointsArray.forEach(function (p) {
                    html += '<i class="mark" style="left:'+p.x+'px;top:'+p.y+'px;"></i>';
                });


                var ctx = $('#canvas').get(0).getContext('2d');
                ctx.strokeStyle = 'yellow';

                contours.forEach(function (contour) {
                    for (var i = 0, l = contour.length; i < l; i++) {
                        html += '<i style="left:'+contour[i].x+'px;top:'+contour[i].y+'px;" class="break"></i>';
                    }
                    drawPath(ctx, contour);
                });

                ctx.stroke();
                $('#points-break').html(html);
            }
        };

        entry.init();

        return entry;
    }
);
