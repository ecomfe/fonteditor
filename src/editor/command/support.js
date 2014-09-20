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

        var support = {

            /**
             * 重置缩放
             */
            rescale: function() {
                this.coverLayer.clearShapes();
                var size = this.render.getSize();
                this.render.scaleTo(1, {
                    x: size.width / 2, 
                    y: size.height / 2
                });
                this.setMode();
            },


            /**
             * 添加shape
             */
            addshape: function() {
                this.setMode('addshape');
            },

            /**
             * 添加rect
             */
            addrect: function() {
                this.setMode('addrect');
            },

            /**
             * 添加circle
             */
            addcircle: function() {
                this.setMode('addcircle');
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
            reversepoint: function(shape) {
                shape.points = shape.points.reverse();
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
                this.setShapes(shapes);
                this.setMode();
            },

            /**
             * 恢复
             */
            redo: function() {
                var shapes = this.history.forward();
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
                        }
                    });
                }

                if(y > 20) {
                    this.axisLayer.addShape('line', {
                        p0: {
                            y: y
                        }
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
                })

                lines.forEach(function(l) {
                    axisLayer.removeShape(l);
                });
                axisLayer.refresh();
            },

        };

        lang.extend(support, require('./transform'));

        return support;
    }
);
