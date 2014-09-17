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
         * @param {number} angle 角度
         */
        function rotate(shapes, angle) {
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
             * 向左旋转
             */
            rotateleft: function(shapes) {
                rotate(shapes, - Math.PI / 2);
                this.fontLayer.refresh();
            },

            /**
             * 向右旋转
             */
            rotateright: function(shapes) {
                rotate(shapes, Math.PI / 2);
                this.fontLayer.refresh();
            },

            /**
             * 翻转
             */
            reverseshapes: function(shapes) {
                mirror(shapes, 1, -1);
                this.fontLayer.refresh();
            },

            /**
             * 镜像
             */
            mirrorshapes: function(shapes) {
                mirror(shapes, -1, 1);
                this.fontLayer.refresh();
            }
        };

        return support;
    }
);
