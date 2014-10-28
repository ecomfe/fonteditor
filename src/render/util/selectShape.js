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

        var computeBoundingBox = require('../../graphics/computeBoundingBox');
        var isPathCross = require('../../graphics/isPathCross');

        /**
         * 从待选的shape中选择一个，作为选中的shape
         * @param {Array} shapes 路径集合
         * @param {Object} p 坐标点
         * @return {Object} selected shape
         */
        function selectShape(shapes, p) {

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

            var selection = start;

            if(2 === result) {
                selection = end;
            }
            else if(3 === result) {
                selection = start;
            }
            else {
                // 如果大小相等，则选择距离中心点远的
                if (p && Math.abs(start._size - end._size) / start._size  < 0.01) {
                    var sx = start._bound.x + start._bound.width / 2;
                    var sy = start._bound.y + start._bound.height / 2;
                    var ex = end._bound.x + end._bound.width / 2;
                    var ey = end._bound.y + end._bound.height / 2;
                    if (
                        Math.pow(p.x - ex, 2) + Math.pow(p.y - ey, 2) 
                        > Math.pow(p.x - sx, 2) + Math.pow(p.y - sy, 2)
                    ) {
                        selection = end;
                    }
                }
            }

            shapes.forEach(function(shape) {
                delete shape._bound;
                delete shape._size;
            });

            return selection;
        }

        return selectShape;
    }
);
