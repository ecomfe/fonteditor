/**
 * @file 寻找关键点
 * @author mengke01(kekee000@gmail.com)
 */

import fitContour from 'graphics/image/contour/fitContour';
import drawPath from 'render/util/drawPath';
import pathUtil from 'graphics/pathUtil';

const data = require('../data/image-contours5');
const entry = {

    /**
     * 初始化
     */
    init() {

        let html = '';
        let contours = [];
        data.forEach(function (points) {

            points.forEach(function (p) {
                html += '<i style="left:' + p.x + 'px;top:' + p.y + 'px;"></i>';
            });

            points = pathUtil.scale(points, 2);
            contours.push(pathUtil.scale(fitContour(points, 2), 0.5));
            points = pathUtil.scale(points, 0.5);
        });


        $('#points').html(html);

        html = '';

        let ctx = $('#canvas').get(0).getContext('2d');
        ctx.strokeStyle = 'pink';

        contours.forEach(function (contour) {
            for (let i = 0, l = contour.length; i < l; i++) {
                html += '<i style="left:' + contour[i].x + 'px;top:' + contour[i].y + 'px;" class="break"></i>';
            }
            drawPath(ctx, contour);
        });

        ctx.stroke();
        $('#points-break').html(html);
    }
};

entry.init();
