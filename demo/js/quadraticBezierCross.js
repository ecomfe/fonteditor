/**
 * @file quadraticBezier.js
 * @author mengke01
 * @date
 * @description
 * 二次贝塞尔求交演示
 */

import isBezierCross from 'graphics/isBezierCross';

const entry = {

    /**
     * 初始化
     */
    init() {
        let canvas = $('#canvas').get(0);
        let ctx = canvas.getContext('2d');
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;

        let points = [
            {x: 132, y: 409},
            {x: 314, y: 227},
            {x: 39, y: 356},
            {x: 181, y: 276},
            {x: 202, y: 567},
            {x: 100, y: 122}
        ];

        // benchmark
        console.time('bezier');
        for (let i = 0; i < 1000; i++) {
            isBezierCross.apply(null, points);
        }
        console.timeEnd('bezier');

        points.forEach(function (p, index) {
            $('[data-index="' + index + '"]').css({
                left: p.x,
                top: p.y
            });
        });


        let point;

        $('.point').on('mousedown', function (e) {
            point = $(this);
        });

        $(document.body).on('mousemove', onMove);
        $(document.body).on('mouseup', function (e) {
            onMove.call(this, e);
            point = null;
        });

        function onMove(e) {
            let px = e.pageX;
            let py = e.pageY;
            if (point) {
                point.css({
                    left: px,
                    top: py
                });
                let p = points[+point.attr('data-index')];
                p.x = px;
                p.y = py;
                draw();
            }
        }

        function draw() {


            ctx.clearRect(0, 0, width, height);
            // 绘制2次贝塞尔曲线
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(points[0].x, points[0].y);
            ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
            ctx.lineWidth = 1;
            ctx.stroke();


            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.moveTo(points[3].x, points[3].y);
            ctx.quadraticCurveTo(points[4].x, points[4].y, points[5].x, points[5].y);
            ctx.lineWidth = 1;
            ctx.stroke();

            // console.log(JSON.stringify(points));

            let r = isBezierCross.apply(null, points);

            if (r) {
                ctx.beginPath();
                r.forEach(function (item) {
                    ctx.moveTo(item.x, item.y);
                    ctx.arc(item.x, item.y, 4, 0, Math.PI * 2, true);
                });
                ctx.fill();
            }

        }

        draw();

    }
};

entry.init();
