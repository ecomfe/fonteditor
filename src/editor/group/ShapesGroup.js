/**
 * @file 形状组对象，用来管理多个形状的组合操作
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var pathAdjust = require('graphics/pathAdjust');
        var lang = require('common/lang');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        var moveTransform = require('./moveTransform');
        var scaleTransform = require('./scaleTransform');
        var rotateTransform = require('./rotateTransform');
        var BoundControl = require('./BoundControl');


        function getBound(shapes) {
            return computeBoundingBox.computePath.apply(null, shapes.map(function (shape) {
                return shape.points;
            }));
        }

        /**
         * 选择组控制器
         * @param {Array} shapes 形状数组
         * @param {Editor} editor Editor对象
         */
        function ShapesGroup(shapes, editor) {
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
        ShapesGroup.prototype.beginTransform = function (point, camera) {

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
                    var sorptionShapes = [];
                    var shapes = this.shapes;
                    var bound = this.bound;

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
                    var referenceLines = this.editor.referenceLineLayer.shapes;
                    var xAxisArray = [];
                    var yAxisArray = [];
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

        };

        /**
         * 根据控制点做图形变换
         *
         * @param {Object} point 控制点
         * @param {Camera} camera 镜头
         * @param {Object} key 控制键位
         */
        ShapesGroup.prototype.transform = function (point, camera, key) {
            if (this.mode === 'move') {
                moveTransform.call(
                    this,
                    camera,
                    key.ctrlKey ? false :  key.altKey,
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
        };

        /**
         * 结束变换
         *
         * @param {Object} point 控制点
         * @param {Camera} camera 镜头
         * @param {Object} key 控制键位
         */
        ShapesGroup.prototype.finishTransform = function (point, camera, key) {

            // 保存最后一次修改
            var coverShapes = this.coverShapes;
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
        };

        /**
         * 设置操作的shapes
         * @param {Array} shapes 形状数组
         */
        ShapesGroup.prototype.setShapes = function (shapes) {

            var coverLayer = this.editor.coverLayer;

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
            this.coverShapes.forEach(function (shape) {
                shape.id = 'cover-' + shape.id;
                shape.selectable = false;
                shape.style = {
                    strokeColor: 'red'
                };
                coverLayer.addShape(shape);
            });
        };

        /**
         * 获取边界
         *
         * @return {Object|false} bound对象或者 `false`
         */
        ShapesGroup.prototype.getBound = function () {
            if (this.shapes.length) {
                return getBound(this.shapes);
            }

            return false;
        };

        /**
         * 设置操作的shapes
         * 三种变化模式，scale/rotate/move
         *
         * @param {string} mode 变换模式
         */
        ShapesGroup.prototype.setMode = function (mode) {
            this.mode = mode;
        };


        /**
         * 移动到指定位置
         *
         * @param {number} mx x偏移
         * @param {number} my y偏移
         */
        ShapesGroup.prototype.move = function (mx, my) {

            this.shapes.forEach(function (shape) {
                pathAdjust(shape.points, 1, 1, mx, my);
            });

            this.editor.fontLayer.refresh();
            this.editor.coverLayer.move(mx, my);
            this.editor.coverLayer.refresh();
        };

        /**
         * 刷新bound
         */
        ShapesGroup.prototype.refresh = function () {
            this.boundControl.refresh(getBound(this.shapes), this.mode);
        };

        /**
         * 注销
         */
        ShapesGroup.prototype.dispose = function () {
            this.editor.coverLayer.clearShapes();
            this.boundControl.dispose();
            this.shapes = this.coverShapes = this.boundControl = this.editor = null;
        };

        return ShapesGroup;
    }
);
