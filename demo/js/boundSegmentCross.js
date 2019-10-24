/**
 * @file quadraticBezier.js
 * @author mengke01
 * @description
 * 线段和bound相交
 */

import isBoundingBoxSegmentCross from 'graphics/isBoundingBoxSegmentCross';

function main() {
    let canvas = $('#canvas').get(0);
    let ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    let points = [
        {x: 50, y: 200},
        {x: 97, y: 98},
        {x: 58, y: 94},
        {x: 105, y: 201}
    ];

    $('[data-index]').each(function (index, item) {
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

        let bound = {
            x: Math.min(points[0].x, points[1].x),
            y: Math.min(points[0].y, points[1].y),
            width: Math.abs(points[0].x - points[1].x),
            height: Math.abs(points[0].y - points[1].y)
        };

        ctx.clearRect(0, 0, width, height);
        // 绘制2次贝塞尔曲线
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(bound.x, bound.y);
        ctx.lineTo(bound.x, bound.y + bound.height);
        ctx.lineTo(bound.x + bound.width, bound.y + bound.height);
        ctx.lineTo(bound.x + bound.width, bound.y);
        ctx.lineTo(bound.x, bound.y);

        ctx.moveTo(points[2].x, points[2].y);
        ctx.lineTo(points[3].x, points[3].y);

        ctx.lineWidth = 1;
        ctx.stroke();
        // console.time('bezier');
        let r = isBoundingBoxSegmentCross(bound, points[2], points[3]);
        // console.timeEnd('bezier');
        console.log(r);

    }

    draw();
}
main();
