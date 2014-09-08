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
        var pathAdjust = require('./pathAdjust');

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
                bound.x = shape.x;
                bound.y = shape.y;
                shape._bound = bound;
                shape._size = bound.width * bound.height;
                return shape;
            }).sort(function (a, b) {
                return a._size - b._size;
            });

            var start = sorted[0];
            var end = sorted[sorted.length - 1];
            
            var startPoints = pathAdjust(lang.clone(start.points), 1, start.x, start.y);
            var endPoints = pathAdjust(lang.clone(end.points), 1, end.x, end.y);

            var result = isPathCross(
                startPoints, endPoints,
                start._bound, end._bound
            );

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
