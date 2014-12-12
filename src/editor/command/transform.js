/**
 * @file transform.js
 * @author mengke01
 * @date 
 * @description
 * shape变换
 */


define(
    function(require) {

        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathRotate = require('graphics/pathRotate');
        var pathAdjust = require('graphics/pathAdjust');

        /**
         * 旋转图形
         * 
         * @param {Array} shapes 图形集合
         * @param {number} angle 弧度
         */
        function rotate(shapes, angle) {
            if (!angle) {
                return false;
            }
            var points = shapes.map(function(shape) {return shape.points;});
            var bound = computeBoundingBox.computePath.apply(null, points);

            var cx = bound.x + (bound.width) / 2;
            var cy = bound.y + (bound.height) / 2;

            points.forEach(function(p) {
                pathRotate(p, angle, cx, cy);
            });
        }

        /**
         * 翻转图形
         * 
         * @param {Array} shapes 图形集合
         * @param {number} xScale x翻转
         * @param {number} yScale y翻转
         * @param {number} x x参考
         * @param {number} x y参考
         */
        function mirror(shapes, xScale, yScale) {
            var points = shapes.map(function(shape) {return shape.points;});
            var bound = computeBoundingBox.computePath.apply(null, points);
            var x = bound.x;
            var y = bound.y;
            var w = bound.width;
            var h = bound.height;
            if (xScale == -1) {
                points.forEach(function(p) {
                    pathAdjust(p, -1, 1, -x, 0);
                    pathAdjust(p, 1, 1, x + w, 0);
                    p.reverse();
                });
                
            }

            if (yScale == -1) {
                points.forEach(function(p) {
                    pathAdjust(p, 1, -1, 0, -y);
                    pathAdjust(p, 1, 1, 0, y + h);
                    p.reverse();
                });
            }
        }

        var support = {

            /**
             * 旋转指定角度
             * @param {Array} shapes 图形集合
             * @param {number} angle 弧度
             */
            rotate: function(shapes, angle) {

                if (!shapes || !shapes.length) {
                    return false;
                }

                var ret = rotate(shapes, angle);
                if (false !== ret) {
                    this.fontLayer.refresh();
                    this.refreshSelected(shapes);
                }
                return ret;
            },

            /**
             * 向左旋转
             * @param {Array} shapes 图形集合
             */
            rotateleft: function(shapes) {
                return support.rotate.call(this, shapes, - Math.PI / 2);
            },

            /**
             * 向右旋转
             * @param {Array} shapes 图形集合
             */
            rotateright: function(shapes) {
                return support.rotate.call(this, shapes, Math.PI / 2);
            },

            /**
             * 翻转
             * @param {Array} shapes 图形集合
             */
            flipshapes: function(shapes) {

                if (!shapes || !shapes.length) {
                    return false;
                }

                mirror(shapes, 1, -1);
                this.fontLayer.refresh();
                this.refreshSelected(shapes);
            },

            /**
             * 镜像
             * @param {Array} shapes 图形集合
             */
            mirrorshapes: function(shapes) {
                
                if (!shapes || !shapes.length) {
                    return false;
                }

                mirror(shapes, -1, 1);
                this.fontLayer.refresh();
                this.refreshSelected(shapes);
            }
        };

        return support;
    }
);
