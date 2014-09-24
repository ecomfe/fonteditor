/**
 * @file font.js
 * @author mengke01
 * @date 
 * @description
 * Editor 的font相关方法
 */


define(
    function(require) {
        
        var initAxis = require('./initAxis');
        var lang = require('common/lang');
        var pathAdjust = require('graphics/pathAdjust');
        var guid = require('render/util/guid');

        /**
         * 初始化字体
         * 
         * @param {Object} font font结构
         */
        function setFont(font) {

            var contours = font.contours;

            var width = this.render.painter.width;
            var height = this.render.painter.height;
            var options = this.options;

            // 坐标原点位置，基线原点
            var offsetX = (width - options.unitsPerEm) / 2;
            var offsetY = (height + (options.unitsPerEm + options.metrics.WinDecent)) / 2;

            // 构造形状集合
            var shapes = contours.map(function(path) {
                var shape = {};
                path = pathAdjust(path, 1, -1);
                shape.points = pathAdjust(path, 1, 1, offsetX, offsetY);
                return shape;
            });

            this.font = font;

            // 重置形状
            this.render.reset();

            var rightSideBearing = offsetX + font.advanceWidth;
            initAxis.call(this, {
                x: offsetX, 
                y: offsetY,
                rightSideBearing: rightSideBearing,
                axisGap: 100
            });

            var fontLayer = this.render.painter.getLayer('font');

            shapes.forEach(function(shape) {
                fontLayer.addShape('path', shape);
            });
            
            this.render.refresh();

            // 重置历史
            this.history.reset();
            this.history.add(this.getShapes());

            this.setMode();

            return this;
        }


        /**
         * 设置编辑中的shapes
         * 
         * @param {Array} shapes 轮廓数组
         * @return {this}
         */
        function setShapes(shapes) {
            var origin = this.render.getLayer('axis').shapes[0];
            var scale = this.render.camera.scale;
            var fontLayer = this.fontLayer;

            // 建立id hash 防止重复
            var shapeIdList = {};
            fontLayer.shapes.forEach(function(shape) {
                shapeIdList[shape.id] = true;
            });

            // 调整坐标系，重置ID
            shapes.forEach(function(shape) {
                pathAdjust(shape.points, scale, -scale);
                pathAdjust(shape.points, 1, 1, origin.x, origin.y);

                if (shapeIdList[shape.id]) {
                    shape.id = guid('shape');
                }

                fontLayer.addShape(shape);
            });

            fontLayer.refresh();
            return this;
        }

        /**
         * 获取编辑中的shapes
         * 
         * @param {Array} shapes 要获取的shapes
         * @return {Array} 获取编辑中的shape
         */
        function getShapes(shapes) {
            var origin = this.render.getLayer('axis').shapes[0];
            shapes = shapes ? lang.clone(shapes) : lang.clone(this.fontLayer.shapes);
            var scale = 1 / this.render.camera.scale;
            
            // 调整坐标系
            shapes.forEach(function(shape) {
                pathAdjust(shape.points, scale, -scale, -origin.x, -origin.y);
            });

            return shapes;
        }

        return {
            setFont: setFont,
            setShapes: setShapes,
            getShapes: getShapes
        };
    }
);
