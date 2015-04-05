/**
 * @file bezier曲线拟合
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function(require) {

        var fitQ2Curve = require('graphics/image/contour/fitQ2Curve');
        var lang = require('common/lang');

        /**
         * 计算bezier曲线B0参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B0(u) {
            var tmp = 1.0 - u;
            return (tmp * tmp);
        }

        /**
         * 计算bezier曲线B1参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B1(u) {
            var tmp = 1.0 - u;
            return (2 * u * (tmp));
        }

        /**
         * 计算bezier曲线B3参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B2(u) {
            return (u * u);
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

                var points =[{"x":50,"y":50},{"x":350,"y":450},{"x":600,"y":60}];

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
                    ctx.quadraticCurveTo(points[1].x,points[1].y,points[2].x,points[2].y);
                    ctx.stroke();

                    var curvePoints = [];
                    var count = 40;
                    var tSegment = 1 / count;
                    for (var i = 0; i < count; i++) {
                        var t = tSegment * i;
                        curvePoints.push({
                            x: points[0].x * B0(t) + points[1].x * B1(t) + points[2].x * B2(t),
                            y: points[0].y * B0(t) + points[1].y * B1(t) + points[2].y * B2(t)
                        });
                    }

                    ctx.fillStyle='green';
                    for (var i = 0; i < count; i++) {
                        ctx.fillRect(curvePoints[i].x, curvePoints[i].y, 2, 2);
                    }

                    var result = fitQ2Curve(lang.clone(curvePoints), 100
                    );
                    result.unshift(points[0]);
                    console.log(result.length);

                    ctx.beginPath();
                    ctx.strokeStyle='blue';
                    //ctx.translate(0, 10);
                    ctx.moveTo(result[0].x, result[0].y);

                    for (var i = 1; i < result.length - 1; i+=2) {
                       ctx.quadraticCurveTo(result[i].x, result[i].y, result[i + 1].x, result[i + 1].y);
                       ctx.moveTo(result[i + 1].x, result[i + 1].y);
                    }

                    ctx.stroke();

                    //ctx.translate(0, -20);
                }

                draw();
            }
        };

        entry.init();

        return entry;
    }
);
