/**
 * @file quadraticBezier.js
 * @author mengke01
 * @date 
 * @description
 * 二次贝塞尔演示
 */

define(
    function(require) {

        var computeBoundingBox = require('render/util/computeBoundingBox');

        var entry = {

            /**
             * 初始化
             */
            init: function() {
                var canvas = $('#canvas').get(0);
                var ctx = canvas.getContext('2d');
                var width = canvas.offsetWidth;
                var height = canvas.offsetHeight;

                var points = [];
                [0, 1, 2].forEach(function(i) {
                    var p = {
                        x: Math.floor(Math.random() * (width - 100) + 50),
                        y: Math.floor(Math.random() * (height - 100) + 50)
                    }
                    points[i] = p;
                    $($('.point').get(i)).css({
                        left: p.x,
                        top: p.y
                    });
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
                    ctx.strokeStyle='black';
                    ctx.moveTo(points[0].x, points[0].y);  
                    ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    var min = {};
                    var max = {};
                    computeBoundingBox.quadraticBezier(
                        [points[0].x, points[0].y],
                        [points[1].x, points[1].y],
                        [points[2].x, points[2].y],
                        min,
                        max
                    );
                    min[0] = Math.floor(min[0]);
                    min[1] = Math.floor(min[1]);
                    max[0] = Math.floor(max[0]);
                    max[0] = Math.floor(max[0]);
                    ctx.beginPath();
                    ctx.strokeStyle='green';
                    ctx.moveTo(min[0], min[1]);
                    ctx.lineTo(min[0], max[1]);
                    ctx.lineTo(max[0], max[1]);
                    ctx.lineTo(max[0], min[1]);
                    ctx.lineTo(min[0], min[1]);
                    ctx.stroke();
                }

                draw();
            }
        };

        entry.init();
        
        return entry;
    }
);