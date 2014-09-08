/**
 * @file quadraticBezier.js
 * @author mengke01
 * @date 
 * @description
 * 二次贝塞尔演示
 */

define(
    function(require) {

        var computeBoundingBox = require('graphics/computeBoundingBox');
        var isLineCross = require('graphics/isLineRayCross');
        var isBezierRayCross = require('graphics/isBezierRayCross');

        var entry = {

            /**
             * 初始化
             */
            init: function() {
                var canvas = $('#canvas').get(0);
                var ctx = canvas.getContext('2d');
                var width = canvas.offsetWidth;
                var height = canvas.offsetHeight;

                var points = [
                    {
                        x: 130,
                        y: 77
                    },
                    {
                        x: 130,
                        y: 148
                    },
                    {
                        x: 65,
                        y: 148
                    },
                    {
                        x: 9,
                        y: 133
                    }
                ];

                // var points = [
                //     {
                //         x: 65,
                //         y: 148
                //     },
                //     {
                //         x: 20,
                //         y: 148
                //     },
                //     {
                //         x: 5,
                //         y: 115
                //     },
                //     {
                //         x: 9,
                //         y: 133
                //     }
                // ];


                $('[data-index="3"]').css({
                    left: points[3].x,
                    top: points[3].y
                })

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
                    //console.time('bezier');
                    var r = isBezierRayCross(points[0], points[1], points[2], points[3]);
                    //console.timeEnd('bezier');
                    console.log(r);
                }

                draw();
            }
        };

        entry.init();
        
        return entry;
    }
);