/**
 * @file initFont.js
 * @author mengke01
 * @date 
 * @description
 * Editor 的font相关方法
 */


define(
    function(require) {
        var lang = require('common/lang');
        var pathAdjust = require('graphics/pathAdjust');
        var pathCeil = require('graphics/pathCeil');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var guid = require('render/util/guid');

        /**
         * 初始化字体
         * 
         * @param {Object} font font结构
         */
        function setFont(font) {

            var contours = font.contours;
            var originX = this.axis.x;
            var originY = this.axis.y;
            var scale = this.render.camera.scale;

            // 不需要在此保存contours
            delete font.contours;
            font.rightSideBearing = font.advanceWidth - font.xMax;
            this.font = font;

            // 重置历史
            this.history.reset();
            this.history.add(lang.clone(contours));

            // 设置字形
            var shapes = contours.map(function(contour) {
                var shape = {};
                pathAdjust(contour, scale, -scale);
                shape.points = pathAdjust(contour, 1, 1, originX, originY);
                return shape;
            });

            var fontLayer = this.fontLayer;
            fontLayer.clearShapes();

            shapes.forEach(function(shape) {
                fontLayer.addShape('path', shape);
            });
            fontLayer.refresh();

            // 设置参考线
            this.rightSideBearing.p0.x = originX + font.advanceWidth * scale;
            this.axisLayer.refresh();

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

        /**
         * 获取编辑后的font
         * 
         * @return {Object} glyfObject
         */
        function getFont() {
            var font = lang.clone(this.font || {});
            font.rightSideBearing = font.rightSideBearing || 0;
            font.unicode = font.unicode || [];
            font.name = font.name || '';

            var shapes = this.getShapes();
            shapes.forEach(function(g) {
                pathCeil(g);
            });

            // 设置边界
            var box = computeBoundingBox.computePathBox.apply(null, shapes.map(function(shape) {
                return shape.points;
            }));
            
            font.xMin = box.x;
            font.yMin = box.y;
            font.xMax = box.x + box.width;
            font.yMax = box.y + box.height;
            font.leftSideBearing = font.xMin;
            font.advanceWidth = font.xMax + font.rightSideBearing;
            delete font.advanceWidth;

            font.contours = shapes;

            return font;
        }

        /**
         * 调整font信息
         * 
         * @param {Object} options 参数选项
         * @param {Object} options.leftSideBearing 左支撑
         * @param {Object} options.rightSideBearing 右支撑
         * @param {Object} options.unicode unicode
         * @param {Object} options.name 名字
         * @return {this}
         */
        function adjustFont(options) {
            if (!this.font) {
                return;
            }

            var scale = this.render.camera.scale;
            var shapes = this.fontLayer.shapes;

            var origin = this.render.getLayer('axis').shapes[0];
            // 计算边界
            var box = computeBoundingBox.computePathBox.apply(null, shapes.map(function(shape) {
                return shape.points;
            }));

            var offset = 0;
            var xMin = box.x - origin.x;

            if (undefined !== options.leftSideBearing && Math.abs(options.leftSideBearing - xMin / scale) > 0.01) {
                offset = options.leftSideBearing * scale - xMin;
                shapes.forEach(function(g) {
                    pathAdjust(g.points, 1, 1, offset, 0);
                });
                this.fontLayer.refresh();
                this.fire('change');
            }
            
            if (undefined !== options.rightSideBearing) {
                this.rightSideBearing.p0.x = box.x + box.width + offset + options.rightSideBearing * scale;
                this.axisLayer.refresh();
            }

            if (undefined !== options.unicode) {
                this.font.unicode = options.unicode;
            }

            if (undefined !== options.name) {
                this.font.name = options.name;
            }

            return this;
        }

        return function() {
            this.setFont = setFont;
            this.getFont = getFont;
            this.adjustFont = adjustFont;

            this.setShapes = setShapes;
            this.getShapes = getShapes;
        };
    }
);
