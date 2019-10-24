/**
 * @file bezier曲线拟合
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable fecs-camelcase JS628 */

import fitCurve from 'graphics/image/contour/fitCurve';
import fitBezier from 'graphics/image/contour/fitBezier';
import lang from 'common/lang';

/**
 * 计算bezier曲线B0参数
 *
 * @param {number} u t值
 * @return {number}
 */
function B0(u) {
    let tmp = 1.0 - u;
    return (tmp * tmp * tmp);
}

/**
 * 计算bezier曲线B1参数
 *
 * @param {number} u t值
 * @return {number}
 */
function B1(u) {
    let tmp = 1.0 - u;
    return (3 * u * (tmp * tmp));
}

/**
 * 计算bezier曲线B2参数
 *
 * @param {number} u t值
 * @return {number}
 */
function B2(u) {
    let tmp = 1.0 - u;
    return (3 * u * u * tmp);
}

/**
 * 计算bezier曲线B3参数
 *
 * @param {number} u t值
 * @return {number}
 */
function B3(u) {
    return (u * u * u);
}

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
            {x: 50,y: 50},
            {x: 264,y: 354},
            {x: 451,y: 332},
            {x: 600,y: 60}
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

        function draw() {
            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.strokeStyle = 'gray';
            ctx.moveTo(points[0].x, points[0].y);
            ctx.bezierCurveTo(points[1].x,
                points[1].y,
                points[2].x,
                points[2].y,
                points[3].x,
                points[3].y);
            ctx.stroke();

            let curvePoints = [];
            let count = 40;
            let tSegment = 1 / count;
            for (let i = 0; i <= count; i++) {
                let t = tSegment * i;
                curvePoints.push({
                    x: points[0].x * B0(t) + points[1].x * B1(t) + points[2].x * B2(t) + points[3].x * B3(t),
                    y: points[0].y * B0(t) + points[1].y * B1(t) + points[2].y * B2(t) + points[3].y * B3(t)
                });
            }

            ctx.fillStyle = 'green';
            for (let i = 0; i < count; i++) {
                ctx.fillRect(curvePoints[i].x, curvePoints[i].y, 2, 2);
            }

            let result = fitCurve(lang.clone(curvePoints), 36);
            result.unshift(points[0]);
            console.log(result.length);

            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            // ctx.translate(0, 5);
            ctx.moveTo(result[0].x, result[0].y);
            for (let i = 1; i < result.length - 1; i += 3) {
                ctx.bezierCurveTo(result[i].x, result[i].y, result[i + 1].x, result[i + 1].y, result[i + 2].x, result[i + 2].y);
                ctx.moveTo(result[i + 2].x, result[i + 2].y);
            }

            ctx.stroke();

            let bezierResult = fitBezier(lang.clone(curvePoints));
            bezierResult.unshift(curvePoints[0]);
            ctx.beginPath();
            ctx.strokeStyle = 'yellow';
            // ctx.translate(0, 5);
            ctx.moveTo(bezierResult[0].x, bezierResult[0].y);
            let last = bezierResult.length - 1;
            console.log(bezierResult.length);
            for (let i = 1; i < last; i += 2) {
                ctx.quadraticCurveTo(bezierResult[i].x, bezierResult[i].y, bezierResult[i + 1].x, bezierResult[i + 1].y);
                ctx.moveTo(bezierResult[i + 1].x, bezierResult[i + 1].y);
            }

            ctx.stroke();

            // ctx.translate(0, -10);
        }

        draw();
    }
};

entry.init();
