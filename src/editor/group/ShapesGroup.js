/**
 * @file 形状组对象，用来管理多个形状的组合操作
 * @author mengke01(kekee000@gmail.com)
 */

import pathAdjust from 'graphics/pathAdjust';
import lang from 'common/lang';
import computeBoundingBox from 'graphics/computeBoundingBox';

import moveTransform from './moveTransform';
import scaleTransform from './scaleTransform';
import rotateTransform from './rotateTransform';
import BoundControl from './BoundControl';


function getBound(shapes) {
    return computeBoundingBox.computePath.apply(null, shapes.map(function (shape) {
        return shape.points;
    }));
}

export default class ShapesGroup {

    /**
     * 选择组控制器
     *
     * @param {Array} shapes 形状数组
     * @param {Editor} editor Editor对象
     */
    constructor(shapes, editor) {
        this.editor = editor;
        this.boundControl = new BoundControl(editor.coverLayer);
        this.setShapes(shapes);
    }

    /**
     * 根据控制点做图形变换
     *
     * @param {Object} point 控制点
     * @param {Camera} camera 镜头
     */
    beginTransform(point, camera) {

        this.bound = getBound(this.shapes);
        this.editor.coverLayer.addShape({
            id: 'bound',
            type: 'polygon',
            dashed: true,
            selectable: false,
            points: []
        });
        this.boundControl.hide();

        // 设置吸附选项
        if (this.mode === 'move' && this.editor.sorption.isEnable()) {

            if (this.editor.sorption.enableShape) {
                let sorptionShapes = [];
                let shapes = this.shapes;
                let bound = this.bound;

                // 加入此group的bound
                sorptionShapes.push({
                    points: [
                        {
                            x: bound.x,
                            y: bound.y,
                            onCurve: true
                        },
                        {
                            x: bound.x + bound.width,
                            y: bound.y + bound.height,
                            onCurve: true
                        }
                    ]
                });

                // 过滤需要吸附的对象
                this.editor.fontLayer.shapes.forEach(function (shape) {
                    if (shapes.indexOf(shape) < 0) {
                        sorptionShapes.push(shape);
                    }
                });

                // 添加参考线
                let referenceLines = this.editor.referenceLineLayer.shapes;
                let xAxisArray = [];
                let yAxisArray = [];
                referenceLines.forEach(function (shape) {
                    if (undefined !== shape.p0.x) {
                        xAxisArray.push(shape.p0.x);
                    }
                    if (undefined !== shape.p0.y) {
                        yAxisArray.push(shape.p0.y);
                    }
                });


                this.editor.sorption.clear();
                sorptionShapes.length && this.editor.sorption.addShapes(sorptionShapes);
                xAxisArray.length && this.editor.sorption.addXAxis(xAxisArray);
                yAxisArray.length && this.editor.sorption.addYAxis(yAxisArray);
            }
        }

    }

    /**
     * 根据控制点做图形变换
     *
     * @param {Object} point 控制点
     * @param {Camera} camera 镜头
     * @param {Object} key 控制键位
     */
    transform(point, camera, key) {
        if (this.mode === 'move') {
            moveTransform.call(
                this,
                camera,
                key.ctrlKey ? false : key.altKey,
                key.ctrlKey ? false : key.shiftKey,
                this.editor.sorption.isEnable()
            );
        }
        else if (this.mode === 'scale') {
            scaleTransform.call(this, point, camera);
        }
        else if (this.mode === 'rotate') {
            rotateTransform.call(this, point, camera);
        }
    }

    /**
     * 结束变换
     *
     * @param {Object} point 控制点
     * @param {Camera} camera 镜头
     * @param {Object} key 控制键位
     */
    finishTransform(point, camera, key) {

        // 保存最后一次修改
        let coverShapes = this.coverShapes;
        this.coverShapes = this.shapes;
        this.transform(point, camera, key);
        this.coverShapes = coverShapes;
        delete this.bound;

        this.editor.coverLayer.removeShape('bound');
        this.editor.coverLayer.removeShape('boundcenter');
        this.editor.fontLayer.refresh();

        if (this.mode === 'move' && this.editor.sorption.isEnable()) {
            this.editor.coverLayer.removeShape('sorptionX');
            this.editor.coverLayer.removeShape('sorptionY');
            this.editor.sorption.clear();
        }

        this.refresh();
    }

    /**
     * 设置操作的shapes
     *
     * @param {Array} shapes 形状数组
     */
    setShapes(shapes) {

        let coverLayer = this.editor.coverLayer;

        if (this.shapes) {
            this.shapes = null;
        }

        if (this.coverShapes) {
            this.coverShapes.forEach(function (shape) {
                coverLayer.removeShape(shape);
            });
            this.coverShapes = null;
        }

        this.shapes = shapes;
        this.coverShapes = lang.clone(this.shapes);
        let outlineColor = this.editor.options.coverLayer.outlineColor;
        this.coverShapes.forEach(function (shape) {
            shape.id = 'cover-' + shape.id;
            shape.selectable = false;
            shape.style = {
                strokeColor: outlineColor
            };
            coverLayer.addShape(shape);
        });
    }

    /**
     * 获取边界
     *
     * @return {Object|false} bound对象或者 `false`
     */
    getBound() {
        if (this.shapes.length) {
            return getBound(this.shapes);
        }

        return false;
    }

    /**
     * 设置操作的shapes
     * 三种变化模式，scale/rotate/move
     *
     * @param {string} mode 变换模式
     */
    setMode(mode) {
        this.mode = mode;
    }


    /**
     * 移动到指定位置
     *
     * @param {number} mx x偏移
     * @param {number} my y偏移
     */
    move(mx, my) {
        this.shapes.forEach(function (shape) {
            pathAdjust(shape.points, 1, 1, mx, my);
        });

        this.editor.fontLayer.refresh();
        this.editor.coverLayer.move(mx, my);
    }

    /**
     * 刷新bound
     */
    refresh() {
        this.boundControl.refresh(getBound(this.shapes), this.mode);
    }

    /**
     * 注销
     */
    dispose() {
        this.editor.coverLayer.clearShapes();
        this.boundControl.dispose();
        this.shapes = this.coverShapes = this.boundControl = this.editor = null;
    }
}
