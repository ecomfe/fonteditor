/**
 * @file 圆曲线拟合
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function(require) {

        var fitCurve = require('graphics/image/fitCurve');
        var fitBezier = require('graphics/image/fitBezier');
        var lang = require('common/lang');



        function dist(p0, p1) {
            return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                var canvas = $('#canvas').get(0);
                var ctx = canvas.getContext('2d');
                var width = canvas.offsetWidth;
                var height = canvas.offsetHeight;

                var points =[{"x":300,"y":300},{"x":500,"y":300}];

                $(points).each(function(index, item) {
                    $('[data-index="'+index+'"]').css({
                        left: points[index].x,
                        top: points[index].y
                    })
                });

                var point;

                $('.point').on('mousedown', function(e) {
                    point = $(this);
                });

                $(document.body).on('mousemove', onMove);
                $(document.body).on('mouseup', function(e) {
                    onMove.call(this, e);
                    point = null;
                });

                function onMove(e) {
                    var px = e.pageX;
                    var py = e.pageY;
                    if(point) {
                        point.css({
                            left: px,
                            top: py
                        });
                        var p = points[+point.attr('data-index')];
                        p.x = px;
                        p.y = py;
                        draw();
                    }
                }

                function draw() {
                    ctx.clearRect(0, 0, width, height);

                    ctx.beginPath();
                    ctx.strokeStyle ='gray';
                    var radius = dist(points[0], points[1]);
                    ctx.arc(points[0].x, points[0].y, radius, 0, 180);
                    ctx.stroke();

                    // var curvePoints = [];
                    // var count = 40;
                    // var tSegment = 1 / count;
                    // for (var i = 0; i < count; i++) {
                    //     var t = tSegment * i;
                    //     curvePoints.push({
                    //         x: points[0].x * B0(t) + points[1].x * B1(t) + points[2].x * B2(t) + points[3].x * B3(t),
                    //         y: points[0].y * B0(t) + points[1].y * B1(t) + points[2].y * B2(t) + points[3].y * B3(t)
                    //     });
                    // }

                    // ctx.fillStyle='green';
                    // for (var i = 0; i < count; i++) {
                    //     ctx.fillRect(curvePoints[i].x, curvePoints[i].y, 2, 2);
                    // }

                    // var result = fitCurve(lang.clone(curvePoints), count);
                    // result.unshift(points[0]);
                    // //console.log(result);

                    // ctx.beginPath();
                    // ctx.strokeStyle='blue';
                    // //ctx.translate(0, 10);
                    // ctx.moveTo(result[0].x, result[0].y);
                    // for (var i = 1; i < result.length - 1; i+=3) {
                    //    ctx.bezierCurveTo(result[i].x, result[i].y, result[i + 1].x, result[i + 1].y, result[i + 2].x, result[i + 2].y);
                    //    ctx.moveTo(result[i + 2].x, result[i + 2].y);
                    // }

                    // ctx.stroke();

                    // var bezierResult = fitBezier(lang.clone(curvePoints));
                    // bezierResult.unshift(curvePoints[0]);
                    // ctx.beginPath();
                    // ctx.strokeStyle='yellow';
                    // //ctx.translate(0, 10);
                    // ctx.moveTo(bezierResult[0].x, bezierResult[0].y);
                    // var last = bezierResult.length - 1;
                    // console.log(bezierResult.length);
                    // for (var i = 1; i < last; i+=2) {
                    //    ctx.quadraticCurveTo(bezierResult[i].x, bezierResult[i].y, bezierResult[i + 1].x, bezierResult[i + 1].y);
                    //    ctx.moveTo(bezierResult[i + 1].x, bezierResult[i + 1].y);
                    // }

                    // ctx.stroke();

                    //ctx.translate(0, -20);
                }

                draw();
            }
        };

        entry.init();

        return entry;
    }
);
