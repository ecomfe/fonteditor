/**
 * @file quadraticBezier.js
 * @author mengke01
 * @date
 * @description
 * 二次贝塞尔直线相交演示
 */

import isSegmentCross from 'graphics/isSegmentCross';

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
            {x: 300, y: 300, onCurve: true},
            {x: 350, y: 350, onCurve: true},
            {x: 200, y: 200},
            {x: 400, y: 400
        }];

        $('[data-index]').each(function (index, item) {
            if (!points[index]) {
                return false;
            }
            $(item).css({
                left: points[index].x,
                top: points[index].y
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
            ctx.lineTo(points[1].x, points[1].y);

            ctx.moveTo(points[2].x, points[2].y);
            if (points[3]) {
                ctx.lineTo(points[3].x, points[3].y);
            }
            else {
                ctx.lineTo(1000, points[2].y);
            }

            ctx.lineWidth = 1;
            ctx.stroke();
            // console.time('bezier');
            let r = isSegmentCross(points[0], points[1], points[2], points[3]);
            // console.timeEnd('bezier');
            console.log(r);

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
