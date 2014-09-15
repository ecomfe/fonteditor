/**
 * @file support.js
 * @author mengke01
 * @date 
 * @description
 * editor 支持的命令列表
 */


define(
    function(require) {

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
            reverseshape: function(shape) {
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
            }
        };

        return support;
    }
);
