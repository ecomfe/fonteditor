/**
 * @file support.js
 * @author mengke01
 * @date 
 * @description
 * editor 支持的命令列表
 */


define(
    function(require) {

        var lang = require('common/lang');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var shapesSupport = require('../shapes/support');

        var support = {

            /**
             * 重置缩放
             */
            rescale: function() {
                this.coverLayer.clearShapes();
                var size = this.render.getSize();
                var scale = 512 / this.options.unitsPerEm;
                this.render.scaleTo(scale, {
                    x: size.width / 2, 
                    y: size.height / 2
                });
                this.setMode();
            },


            /**
             * 添加path
             */
            addpath: function() {
                this.setMode('addpath');
            },

            /**
             * 添加自选图形
             */
            addsupportshapes: function(type) {
                if (shapesSupport[type]) {
                    this.setMode('addshapes', lang.clone(shapesSupport[type]));
                }
            },

            /**
             * 移除shape
             */
            removeshapes: function(shapes) {
                var fontLayer = this.fontLayer;
                shapes.forEach(function(shape) {
                    fontLayer.removeShape(shape);
                });
                fontLayer.refresh();
            },

            /**
             * 反转shape
             */
            reversepoint: function(shapes) {
                shapes.forEach(function(shape) {
                    shape.points = shape.points.reverse();
                });

                this.fontLayer.refresh();
            },

            /**
             * 设置shape到顶层
             */
            topshape: function(shape) {
                var index = this.fontLayer.shapes.indexOf(shape);
                this.fontLayer.shapes.splice(index, 1);
                this.fontLayer.shapes.push(shape);
            },

            /**
             * 设置shape到底层
             */
            bottomshape: function(shape) {
                var index = this.fontLayer.shapes.indexOf(shape);
                this.fontLayer.shapes.splice(index, 1);
                this.fontLayer.shapes.unshift(shape);
            },

            /**
             * 提升shape层级
             */
            upshape: function(shape) {
                var index = this.fontLayer.shapes.indexOf(shape);
                this.fontLayer.shapes.splice(index, 1);
                this.fontLayer.shapes.splice(index + 1, 0, shape);
            },

            /**
             * 降低shape层级
             */
            downshape: function(shape) {
                var index = this.fontLayer.shapes.indexOf(shape);
                this.fontLayer.shapes.splice(index, 1);
                this.fontLayer.shapes.splice(index - 1, 0, shape);
            },

            /**
             * 撤销
             */
            undo: function() {
                var shapes = this.history.back();
                this.fontLayer.shapes.length = 0;
                this.setShapes(shapes);
                this.setMode();
            },

            /**
             * 恢复
             */
            redo: function() {
                var shapes = this.history.forward();
                this.fontLayer.shapes.length = 0;
                this.setShapes(shapes);
                this.setMode();
            },

            /**
             * 添加参考线
             */
            addreferenceline: function(x, y) {
                if(x > 20) {
                    this.axisLayer.addShape('line', {
                        p0: {
                            x: x
                        },
                        style: this.options.referenceline.style
                    });
                }

                if(y > 20) {
                    this.axisLayer.addShape('line', {
                        p0: {
                            y: y
                        },
                        style: this.options.referenceline.style
                    });
                }
                this.axisLayer.refresh();
            },

            /**
             * 移除参考线
             */
            removereferenceline: function(x, y) {
                var lines = [];
                // 如果传入的是shape对象
                if(typeof(x) === 'object') {
                    lines.push(x);
                }

                var axisLayer = this.axisLayer;
                var rightSideBearing = this.rightSideBearing;

                // 获取选中的参考线
                if(x > 20 || y > 20) {
                    var result = this.axisLayer.getShapeIn(x, y);
                    lines = lines.concat(result);
                }

                // rightside bearing 线不可移除
                lines = lines.filter(function(line) {
                    return line !== rightSideBearing;
                });

                lines.forEach(function(l) {
                    axisLayer.removeShape(l);
                });
                axisLayer.refresh();
            },

            /**
             * 清除参考线
             */
            clearreferenceline: function() {
                var axisLayer = this.axisLayer;
                var rightSideBearing = this.rightSideBearing;
                var lines = axisLayer.shapes.filter(function(line) {
                    return line.type === 'line' && line !== rightSideBearing;
                });

                lines.forEach(function(l) {
                    axisLayer.removeShape(l);
                });
                axisLayer.refresh();
            },

            /**
             * 剪切shapes
             * 
             * @param {Array} shapes 形状集合
             */
            cutshapes: function(shapes) {
                var cutedShapes = this.getShapes(shapes);
                this.setClipBoard(cutedShapes);
                var fontLayer = this.fontLayer;
                shapes.forEach(function(shape) {
                    fontLayer.removeShape(shape);
                });
                fontLayer.refresh();
            },

            /**
             * 复制shapes
             * 
             * @param {Array} shapes 形状集合
             */
            copyshapes: function(shapes) {
                shapes = this.getShapes(shapes);
                this.setClipBoard(shapes);
            },

            /**
             * 增加shapes
             * 
             * @param {Array} shapes 形状集合
             */
            addshapes: function(shapes) {
                this.setShapes(shapes);
            },

            /**
             * 设置字体信息
             */
            font: function() {

                // 计算边界
                var box = computeBoundingBox.computePathBox.apply(null, this.fontLayer.shapes.map(function(shape) {
                    return shape.points;
                }));

                var leftSideBearing = 0;
                var rightSideBearing = 0;
                
                if (box) {
                    var scale = this.render.camera.scale;
                    var leftSideBearing = (box.x - this.axis.x) / scale;
                    var rightSideBearing = (this.rightSideBearing.p0.x - box.x - box.width) / scale; 
                }

                this.fire('setting:font', {
                    setting: {
                        leftSideBearing: Math.round(leftSideBearing),
                        rightSideBearing: Math.round(rightSideBearing || 0),
                        unicode: this.font.unicode,
                        name: this.font.name                        
                    }
                });
            }
        };

        lang.extend(support, require('./transform'));
        lang.extend(support, require('./shapes'));

        return support;
    }
);
