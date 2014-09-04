/**
 * @file quadraticBezier.js
 * @author mengke01
 * @date 
 * @description
 * 二次贝塞尔求交演示
 */

define(
    function(require) {

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

                // var points = [];
                // [0, 1, 2, 3].forEach(function(i) {
                //     var p = {
                //         x: Math.floor(Math.random() * (width - 100) + 50),
                //         y: Math.floor(Math.random() * (height - 100) + 50)
                //     }
                //     points[i] = p;
                //     $($('.point').get(i)).css({
                //         left: p.x,
                //         top: p.y
                //     });
                // });

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
                        x: 330,
                        y: 77
                    },
                    {
                        x: 130,
                        y: 148
                    },
                    {
                        x: 165,
                        y: 148
                    }
                ];


                points.forEach(function(p, index) {
                    $('[data-index="'+index+'"]').css({
                        left: p.x,
                        top: p.y
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
                    ctx.strokeStyle='black';
                    ctx.moveTo(points[0].x, points[0].y);  
                    ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
                    ctx.lineWidth = 1;
                    ctx.stroke();


                    ctx.beginPath();
                    ctx.strokeStyle='green';
                    ctx.moveTo(points[3].x, points[3].y);  
                    ctx.quadraticCurveTo(points[4].x, points[4].y, points[5].x, points[5].y);
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    //console.time('bezier');
                    var r = isBezierCross.apply(null, points);
                    //console.timeEnd('bezier');
                    //console.log(r);
                }

                draw();
            }
        };

        entry.init();
        
        return entry;
    }
);