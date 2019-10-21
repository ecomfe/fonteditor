/**
 * @file 添加轮廓模式
 * @author mengke01(kekee000@gmail.com)
 */

import pathAdjust from 'graphics/pathAdjust';
import computeBoundingBox from 'graphics/computeBoundingBox';
import lang from 'common/lang';

export default {

    down(e) {
        if (1 === e.which) {

            // 初始化空路径
            this.coverLayer.clearShapes();
            for (let i = 0, l = this.curShapes.length; i < l; i++) {
                this.coverLayer.addShape('path', {
                    points: []
                });
            }

            this.curBound = computeBoundingBox.computePath.apply(
                null,
                this.curShapes
            );
        }
    },

    drag(e) {
        if (1 === e.which) {
            if (this.curShapes) {
                let x = e.startX;
                let y = e.startY;
                let w = e.x - e.startX;
                let h = e.y - e.startY;
                let xScale = w / this.curBound.width;
                let yScale = h / this.curBound.height;

                // 等比缩放
                if (e.shiftKey) {
                    let scale = Math.min(Math.abs(xScale), Math.abs(yScale));
                    xScale = xScale > 0 ? scale : -scale;
                    yScale = yScale > 0 ? scale : -scale;
                }

                // 初始化空路径
                let shapes = this.curShapes;
                let coverShapes = this.coverLayer.shapes;
                for (let i = 0, l = shapes.length; i < l; i++) {
                    let points = lang.clone(shapes[i]);
                    pathAdjust(points, xScale, yScale);
                    pathAdjust(points, 1, 1, x, y);
                    coverShapes[i].points = points;
                }
                this.coverLayer.refresh();
            }
        }
    },


    dragend(e) {
        if (1 === e.which) {

            if (this.curShapes) {
                let fontLayer = this.fontLayer;
                let shapes = lang.clone(this.coverLayer.shapes);
                for (let i = 0, l = shapes.length; i < l; i++) {
                    fontLayer.addShape(shapes[i]);
                }

                fontLayer.refresh();
                this.fire('change');
                this.setMode('shapes', shapes);
                return;
            }

            this.setMode();
        }
    },


    begin(shapes) {
        this.render.setCursor('crosshair');
        this.curShapes = shapes;
    },


    end() {
        this.curShapes = this.curBound = null;
        this.coverLayer.clearShapes();
        this.coverLayer.refresh();
        this.render.setCursor('default');
    }
};
