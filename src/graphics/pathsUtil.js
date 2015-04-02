/**
 * @file 路径组变化函数
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var computeBoundingBox = require('./computeBoundingBox');
        var pathAdjust = require('./pathAdjust');
        var pathRotate = require('./pathRotate');

        /**
         * 旋转路径
         *
         * @param {Array} paths 路径数组
         * @param {number} angle 弧度
         * @return {Array} 变换后的路径
         */
        function rotatePaths(paths, angle) {
            if (!angle) {
                return paths;
            }

            var bound = computeBoundingBox.computePath.apply(null, paths);

            var cx = bound.x + (bound.width) / 2;
            var cy = bound.y + (bound.height) / 2;

            paths.forEach(function (p) {
                pathRotate(p, angle, cx, cy);
            });

            return paths;
        }



        /**
         * 翻转路径
         *
         * @param {Array} paths 路径数组
         * @param {number} xScale x翻转
         * @param {number} yScale y翻转
         * @return {Array} 变换后的路径
         */
        function mirrorPaths(paths, xScale, yScale) {

            var bound = computeBoundingBox.computePath.apply(null, paths);
            var x = bound.x;
            var y = bound.y;
            var w = bound.width;
            var h = bound.height;

            if (xScale === -1) {
                paths.forEach(function (p) {
                    pathAdjust(p, -1, 1, -x, 0);
                    pathAdjust(p, 1, 1, x + w, 0);
                    p.reverse();
                });

            }

            if (yScale === -1) {
                paths.forEach(function (p) {
                    pathAdjust(p, 1, -1, 0, -y);
                    pathAdjust(p, 1, 1, 0, y + h);
                    p.reverse();
                });
            }

            return paths;
        }


        /**
         * 移动路径组
         *
         * @param {Array} paths 路径数组
         * @param {number} x x
         * @param {number} y y
         * @return {Array} 变换后的路径
         */
        function movePaths(paths, xScale, yScale) {
            var bound = computeBoundingBox.computePath.apply(null, paths);
            shapes.forEach(function (shape) {
                pathAdjust(shape.points, 1, 1, x - bound.x, y - bound.y - bound.height);
            });

            return paths;
        }

        return {
            rotate: rotatePaths,
            mirror: function (paths) {
                return mirrorPaths(paths, -1, 1)
            },
            flip: function (paths) {
                return mirrorPaths(paths, 1, -1)
            },
            move: movePaths
        };
    }
);
