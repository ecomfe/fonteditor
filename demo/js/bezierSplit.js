/**
 * @file bezierSplit.js
 * @author mengke01
 * @date
 * @description
 * bezier分割
 */

import splitBezier from 'math/bezierQ2Split';

function main() {
    let canvas = $('#canvas').get(0);
    let ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    let points = [
        {x: 400.74906, y: 658.69371, onCurve: true},
        {x: 343.80109577246503, y: 678.5444583886682},
        {x: 296, y: 722, onCurve: true},
        {x: 484.52353, y: 642.49215, index0: 2, index1: 12, index: 18}
    ];

    $(points).each(function (index, item) {
        $('[data-index="' + index + '"]').css({
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

    function getPoint(p0, p1, p2, t) {
        return {
            x: p0.x * Math.pow(1 - t, 2) + 2 * p1.x * t * (1 - t) + p2.x * Math.pow(t, 2),
            y: p0.y * Math.pow(1 - t, 2) + 2 * p1.y * t * (1 - t) + p2.y * Math.pow(t, 2)
        };
    }

    function draw() {


        ctx.clearRect(0, 0, width, height);
        // 绘制2次贝塞尔曲线
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'gray';

        ctx.moveTo(points[0].x, points[0].y);
        ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
        ctx.stroke();



        let result = splitBezier(points[0], points[1], points[2], getPoint(points[0], points[1], points[2], 0.5));
        result.forEach(function (bezier, i) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = i ? 'blue' : 'red';
            ctx.moveTo(bezier[0].x, bezier[0].y);
            ctx.quadraticCurveTo(bezier[1].x, bezier[1].y, bezier[2].x, bezier[2].y);
            ctx.stroke();
        });



    }

    draw();
}

main();
