/**
 * @file quadraticBezier.js
 * @author mengke01
 * @date 
 * @description
 * 三次贝塞尔转二次
 */

define(
    function(require) {

        var bezierCubic2Q2 = require('math/bezierCubic2Q2');

        var entry = {

            /**
             * 初始化
             */
            init: function() {
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
                    //绘制2次贝塞尔曲线  
                    ctx.beginPath();
                    ctx.strokeStyle='red';

                    ctx.moveTo(points[0].x, points[0].y);  
                    ctx.bezierCurveTo(points[1].x,points[1].y,points[2].x,points[2].y,points[3].x,points[3].y);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.strokeStyle='blue';
                    bezierCubic2Q2.apply(null, points).forEach(function(bezier) {
                        ctx.moveTo(bezier[0].x, bezier[0].y);  
                        ctx.quadraticCurveTo(bezier[1].x, bezier[1].y, bezier[2].x, bezier[2].y);
                    });

                    ctx.stroke();

                }

                draw();
            }
        };

        entry.init();
        
        return entry;
    }
);