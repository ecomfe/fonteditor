/**
 * @file render.js
 * @author mengke01
 * @date
 * @description
 * render 组件测试
 */

import '../css/render.less';
import render from 'render/main';
import pathAdjust from 'graphics/pathAdjust';

const shape_baidu = require('../data/shape-baidu');
const shape_bdjk = require('../data/shape-bdjk');

let currentRender;

const entry = {

    /**
     * 初始化
     */
    init() {
        currentRender = render.create($('#render-view').get(0));

        let cover = currentRender.addLayer('cover', {
            level: 20
        });

        cover.options.fill = false;
        cover.options.strokeColor = 'green';

        cover.addShape('circle', {
            x: 234,
            y: 213,
            r: 10
        });

        cover.addShape('circle', {
            x: 55,
            y: 464,
            r: 10
        });

        cover.addShape('circle', {
            x: 55,
            y: 212,
            r: 50
        });

        let shape1 = cover.addShape('rect', {
            x: 55,
            y: 464,
            width: 30,
            height: 32
        });

        let shape2 = cover.addShape('rect', {
            x: 344,
            y: 78,
            width: 30,
            height: 42
        });

        let shape3 = cover.addShape('polygon', {
            points: [
                {x: 300, y: 344},
                {x: 350, y: 344},
                {x: 450, y: 400},
                {x: 400, y: 400}
            ],
            dashed: true
        });

        let font = currentRender.addLayer('font', {
            level: 10
        });


        shape_bdjk.contours.forEach(function (contour) {
            pathAdjust(contour, 0.5, 0.5);
            pathAdjust(contour, 1, 1, 300, 100);
        });
        font.addShape('font', shape_bdjk);

        shape_baidu.contours.forEach(function (contour) {
            let shape = {};
            shape.points = contour;
            shape.points = pathAdjust(contour, 1, 1, 100, 400);
            font.addShape('path', shape);
        });

        currentRender.refresh();
    }
};

entry.init();
