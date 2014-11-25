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
        var compoundGlyf = require('graphics/compoundGlyf');
        var getFontHash = require('../util/getFontHash');

        /**
         * 初始化字体
         * 
         * @param {Object} font font结构
         */
        function setFont(font) {

            this.font = font;
            this.fontHash = getFontHash(font);
            
            var originX = this.axis.x;
            var originY = this.axis.y;
            // 设置字形
            var fontLayer = this.fontLayer;
            fontLayer.clearShapes();

            // 简单字形
            if (!font.compound) {
                var contours = font.contours || [];

                // 不需要在此保存contours
                delete font.contours;

                // 这里由于advanceWidth=rightSideBearing+xMax，原来的设置可能会不准确，重新计算
                var box = computeBoundingBox.computePathBox.apply(null, contours);
                if (box) {
                    font.rightSideBearing = font.advanceWidth - box.x - box.width;
                }
                else {
                    font.rightSideBearing = font.advanceWidth;
                }

                contours.forEach(function(contour) {
                    fontLayer.addShape('path', {
                        points: contour
                    });
                });

                var shapes = fontLayer.shapes;

                // 重置历史
                this.history.reset();
                this.history.add(lang.clone(shapes));

                // 设置缩放
                var scale = this.render.camera.scale;
                shapes.forEach(function(shape) {
                    pathAdjust(shape.points, scale, -scale);
                    pathAdjust(shape.points, 1, 1, originX, originY);
                });
            }

            fontLayer.refresh();

            // 设置参考线
            var advanceWidth = font.advanceWidth;
            this.rightSideBearing.p0.x = originX + (advanceWidth || this.options.unitsPerEm) * scale;
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
            var origin = this.axis;
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
         * 设置编辑中的轮廓
         * 
         * @param {Array} contours 轮廓数组
         * @return {[type]} [return description]
         */
        function addContours(contours) {
            if (!contours || contours.length === 0) {
                return this;
            }

            this.setShapes(contours.map(function(contour){
                return {
                    id: guid('shape'),
                    type: 'path',
                    points: contour
                };
            }));

            this.fire('change');

            return this;
        }

        /**
         * 获取编辑中的shapes
         * 
         * @param {Array} shapes 要获取的shapes
         * @return {Array} 获取编辑中的shape
         */
        function getShapes(shapes) {
            var origin = this.axis;
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
            font.unicode = font.unicode || [];
            font.name = font.name || '';

            var origin = this.axis;
            var advanceWidth = Math.round((this.rightSideBearing.p0.x - origin.x) / this.render.camera.scale);
            var shapes = this.getShapes();
            var contours = shapes.map(function(shape) {
                return shape.points;
            });

            contours.forEach(function(g) {
                pathCeil(g);
            });

            // 设置边界
            var box = computeBoundingBox.computePathBox.apply(null, contours) || {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            
            font.xMin = box.x;
            font.yMin = box.y;
            font.xMax = box.x + box.width;
            font.yMax = box.y + box.height;
            font.leftSideBearing = font.xMin;

            // 这里仅还原之前的设置
            if (box.width == 0) {
                font.advanceWidth = font.rightSideBearing;
            }
            else {
                font.advanceWidth = advanceWidth || (font.xMax + font.rightSideBearing) || font.xMax;
            }

            delete font.rightSideBearing;

            font.contours = contours;

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

            var origin = this.axis;
            // 计算边界
            var box = computeBoundingBox.computePathBox.apply(null, shapes.map(function(shape) {
                return shape.points;
            }));

            if (box) {
                var offset = 0;
                var xMin = box.x - origin.x;

                // 左边轴
                if (undefined !== options.leftSideBearing && Math.abs(options.leftSideBearing - xMin / scale) > 0.01) {
                    offset = options.leftSideBearing * scale - xMin;
                    shapes.forEach(function(g) {
                        pathAdjust(g.points, 1, 1, offset, 0);
                    });
                    this.fontLayer.refresh();
                    this.font.leftSideBearing = options.leftSideBearing;
                    this.fire('change');
                }
                
                // 右边轴
                if (undefined !== options.rightSideBearing) {
                    this.font.rightSideBearing = options.rightSideBearing;
                    this.rightSideBearing.p0.x = box.x + box.width + offset + options.rightSideBearing * scale;
                    this.axisLayer.refresh();
                }
            }
            else {
                this.font.rightSideBearing = options.rightSideBearing;
            }

            if (undefined !== options.unicode) {
                this.font.unicode = options.unicode;
            }

            if (undefined !== options.name) {
                this.font.name = options.name;
            }

            this.fire('change');
            return this;
        }

        return function() {
            this.setFont = setFont;
            this.getFont = getFont;
            this.adjustFont = adjustFont;

            this.setShapes = setShapes;
            this.getShapes = getShapes;
            this.addContours = addContours;
        };
    }
);
