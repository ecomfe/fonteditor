/**
 * @file adjustShape.js
 * @author mengke01
 * @date 
 * @description
 * 根据相对值，调整shape大小
 */


define(
    function(require) {

        var pathIterator = require('render/util/pathIterator');

        /**
         * 根据相对值，调整shape大小
         */
        function adjustShape(shape, matrix) {
            var scaleX = matrix[2];
            var scaleY = matrix[3];
            var offsetX = 0;
            var offsetY = 0;

            if (scaleX < 0) {
                offsetX = -shape.width;
            }

            if(scaleY < 0) {
                offsetY = -shape.height;
            }

            pathIterator(shape.points, function(c, i, p0, p1, p2) {
                if (c == 'Q') {
                    p1.x = scaleX * (p1.x + offsetX);
                    p1.y = scaleY * (p1.y + offsetY);
                    p2.x = scaleX * (p2.x + offsetX);
                    p2.y = scaleY * (p2.y + offsetY);
                }
                else {
                    p0.x = scaleX * (p0.x + offsetX);
                    p0.y = scaleY * (p0.y + offsetY);
                }
            });

            shape.x = matrix[0];
            shape.y = matrix[1];
            shape.width = shape.width * Math.abs(scaleX);
            shape.height = shape.height * Math.abs(scaleY);

            return shape;
        }


        return adjustShape;
    }
);