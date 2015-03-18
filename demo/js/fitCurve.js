/**
 * @file bezier曲线拟合
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function(require) {

        var fitCurve = require('graphics/image/fitCurve');



        /**
         * 计算bezier曲线B0参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B0(u) {
            var tmp = 1.0 - u;
            return (tmp * tmp * tmp);
        }

        /**
         * 计算bezier曲线B1参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B1(u) {
            var tmp = 1.0 - u;
            return (3 * u * (tmp * tmp));
        }

        /**
         * 计算bezier曲线B2参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B2(u) {
            var tmp = 1.0 - u;
            return (3 * u * u * tmp);
        }

        /**
         * 计算bezier曲线B3参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B3(u) {
            return (u * u * u);
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

                var points =[{"x":167,"y":449},{"x":233,"y":331},{"x":431,"y":332},{"x":481,"y":417}];

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
                    ctx.strokeStyle='gray';
                    ctx.moveTo(points[0].x, points[0].y);
                    ctx.bezierCurveTo(points[1].x,points[1].y,points[2].x,points[2].y,points[3].x,points[3].y);
                    ctx.stroke();

                    var curvePoints = [];
                    var count = 40;
                    var tSegment = 1 / count;
                    for (var i = 0; i < count; i++) {
                        var t = tSegment * i;
                        curvePoints.push({
                            x: points[0].x * B0(t) + points[1].x * B1(t) + points[2].x * B2(t) + points[3].x * B3(t),
                            y: points[0].y * B0(t) + points[1].y * B1(t) + points[2].y * B2(t) + points[3].y * B3(t)
                        });
                    }

                    ctx.fillStyle='green';
                    for (var i = 0; i < count; i++) {
                        ctx.fillRect(curvePoints[i].x, curvePoints[i].y, 2, 2);
                    }

                    var result = fitCurve(curvePoints, 100);
                    result.unshift(points[0]);
                    console.log(result);

                    ctx.strokeStyle='blue';
                    for (var i = 3; i < result.length - 1; i+=3) {
                        var p = {
                            x: (result[i].x + result[i + 1].x) / 2,
                            y: (result[i].y + result[i + 1].y) / 2
                        };
                        result.push(p);
                        i++;
                    }

                    ctx.moveTo(result[0].x, result[0].y);
                    for (var i = 0; i < result.length - 1; i+=4) {
                       ctx.bezierCurveTo(result[i + 1].x, result[i + 1].y, result[i + 2].x, result[i + 2].y, result[i + 3].x, result[i + 3].y);
                       ctx.moveTo(result[i + 3].x, result[i + 3].y);
                    }

                    ctx.stroke();

                }

                draw();
            }
        };

        entry.init();

        return entry;
    }
);
