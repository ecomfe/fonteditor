/**
 * @file align.js
 * @author mengke01
 * @date 
 * @description
 * 轮廓对齐方式
 */


define(
    function(require) {
        var lang = require('common/lang');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('graphics/pathAdjust');

        var support = {

            /**
             * 对齐方式
             * 
             * @param {Array} shapes 形状集合
             * @param {string} align 对齐方式
             */
            alignshapes: function(shapes, align) {

                if (!shapes || !shapes.length) {
                    return false;
                }

                var contours = shapes.map(function(shape) {
                    return shape.points;
                });

                // 求边界线
                var bound = computeBoundingBox.computePath.apply(null, contours);
                bound.x1 = bound.x + bound.width;
                bound.y1 = bound.y + bound.height;
                bound.xc = bound.x + bound.width / 2;
                bound.yc = bound.y + bound.height / 2;

                var xOffset;
                var yOffset;
                contours.forEach(function(contour) {
                    var b = computeBoundingBox.computePath(contour);
                    xOffset = 0;
                    yOffset = 0;

                    if ('left' === align) {
                        xOffset = bound.x - b.x;
                    }
                    else if ('center' === align) {
                        xOffset = bound.xc - b.x - b.width / 2;
                    }
                    else if ('right' === align) {
                        xOffset = bound.x1 - b.x - b.width;
                    }
                    else if ('top' === align) {
                        yOffset = bound.y - b.y;
                    }
                    else if ('middle' === align) {
                        yOffset = bound.yc - b.y - b.height / 2;
                    }
                    else if ('bottom' === align) {
                        yOffset = bound.y1 - b.y - b.height;
                    }
                    pathAdjust(contour, 1, 1, xOffset, yOffset);
                });

                this.fontLayer.refresh();
                this.refreshSelected(shapes);
            },

            /**
             * 字体垂直对齐
             * 
             * @param {Array} shapes 形状集合
             * @param {string} align 对齐方式
             */
            verticalalignshapes: function(shapes, align) {

                if (!shapes || !shapes.length) {
                    return false;
                }
                
                var contours = shapes.map(function(shape) {
                    return shape.points;
                });

                var metrics = this.axis.metrics;
                var ybaseline = this.axis.y; // 基线
                var yascent = ybaseline - metrics.ascent; // 上升
                var ydescent = ybaseline - metrics.descent; // 下降
                var ymiddle = (yascent + ydescent) / 2; // 中间

                // 求边界线
                var bound = computeBoundingBox.computePath.apply(null, contours);
                var yOffset = 0;

                if ('ascent' === align) {
                    yOffset = yascent - bound.y;
                }
                else if ('middle' === align) {
                    yOffset = ymiddle - bound.y - bound.height / 2;
                }
                else if ('descent' === align) {
                    yOffset = ydescent - bound.y - bound.height;
                }
                else if ('baseline' === align) {
                    yOffset = ybaseline - bound.y - bound.height;
                }

                contours.forEach(function(contour) {
                    pathAdjust(contour, 1, 1, 0, yOffset);
                });

                this.fontLayer.refresh();
                this.refreshSelected(shapes);
            },

            /**
             * 字体水平对齐
             * 
             * @param {Array} shapes 形状集合
             * @param {string} align 对齐方式
             */
            horizontalalignshapes: function(shapes, align) {

                if (!shapes || !shapes.length) {
                    return false;
                }
                
                var contours = shapes.map(function(shape) {
                    return shape.points;
                });

                var xbaseline = this.axis.x; // 基线
                var rightSideBearing = this.rightSideBearing.p0.x;

                // 求边界线
                var bound = computeBoundingBox.computePath.apply(null, contours);
                var xOffset = 0;

                if ('left' === align) {
                    xOffset = xbaseline - bound.x;
                }
                else if ('center' === align) {
                    xOffset = (xbaseline + rightSideBearing) / 2 - bound.x - bound.width / 2;
                }
                else if ('right' === align) {
                    xOffset = rightSideBearing - bound.x - bound.width;
                }

                contours.forEach(function(contour) {
                    pathAdjust(contour, 1, 1, xOffset, 0);
                });

                this.fontLayer.refresh();
                this.refreshSelected(shapes);
            }

        };

        return support;
    }
);
