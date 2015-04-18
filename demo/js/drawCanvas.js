/**
 * @file 绘制canvas曲线
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');


        function drawBezier (val) {
            var path = JSON.parse(val);
            ctx.clearRect(0, 0, 1000, 1000);
            ctx.beginPath();
            ctx.fillStyle = 'black';

            for (var i = 0; i < path.length; i++) {

                var cubic = path[i].map(function (p) {
                    p.x = Math.round(p.x);
                    p.y = Math.round(p.y);
                    return p;
                });
                if (i === 0) {
                    ctx.moveTo(cubic[0].x, cubic[0].y);
                }

                // 退化成直线
                if (cubic[0].x == cubic[1].x && cubic[0].y == cubic[1].y && cubic[2].x == cubic[3].x && cubic[2].y == cubic[3].y) {
                    ctx.lineTo(cubic[2].x, cubic[2].y);
                }
                else {
                    ctx.bezierCurveTo(cubic[1].x, cubic[1].y, cubic[2].x, cubic[2].y,cubic[3].x, cubic[3].y);
                }
            }
            ctx.fill();
        }




        var entry = {

            /**
             * 初始化
             */
            init: function () {


                $('#textarea').on('change', function (e) {
                    drawBezier(e.target.value);
                });

                drawBezier($('#textarea').val());
            }
        };

        entry.init();

        return entry;
    }
);
