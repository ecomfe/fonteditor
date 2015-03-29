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
                }

                draw();
            }
        };

        entry.init();

        return entry;
    }
);
