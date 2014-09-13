/**
 * @file selectShape.js
 * @author mengke01
 * @date 
 * @description
 * 从待选的shape中选择一个，作为选中的shape 
 *
 */


define(
    function(require) {
        var lang = require('common/lang');
        var computeBoundingBox = require('../../graphics/computeBoundingBox');
        var isPathCross = require('../../graphics/isPathCross');
        var pathAdjust = require('graphics/pathAdjust');

        /**
         * 从待选的shape中选择一个，作为选中的shape
         * 
         * @return {Object} selected shape
         */
        function selectShape(shapes) {

            if (shapes.length == 1) {
                return shapes[0];
            }

            var sorted = shapes.map(function(shape) {
                var bound = computeBoundingBox.computePath(shape.points);
                shape._bound = bound;
                shape._size = bound.width * bound.height;
                return shape;
            }).sort(function (a, b) {
                return a._size - b._size;
            });

            var start = sorted[0];
            var end = sorted[sorted.length - 1];

            var result = isPathCross(
                start.points, end.points,
                start._bound, end._bound
            );

            shapes.forEach(function(shape) {
                delete shape._bound;
                delete shape._size;
            });

            if(2 === result) {
                return start;
            }
            else if(3 === result) {
                return end;
            }
            else {
                return shapes[0];
            }
        }

        return selectShape;
    }
);
