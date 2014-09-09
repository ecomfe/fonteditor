/**
 * @file adjustShape.js
 * @author mengke01
 * @date 
 * @description
 * 根据相对值，调整shape大小
 */


define(
    function(require) {

        /**
         * 根据相对值，调整shape大小
         */
        function adjustShape(shape, matrix) {
            var i = -1;
            var l = shape.points.length;
            var point;

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

            while (++i < l) {
                var point = shape.points[i];
                switch (point.c) {
                    case 'M':
                    case 'L':
                        point.p.x = scaleX * (point.p.x + offsetX);
                        point.p.y = scaleY * (point.p.y + offsetY);
                        break;
                    case 'Q':
                        point.p.x = scaleX * (point.p.x + offsetX);
                        point.p.y = scaleY * (point.p.y + offsetY);
                        point.p1.x = scaleX * (point.p1.x + offsetX);
                        point.p1.y = scaleY * (point.p1.y + offsetY);
                        break;
                }
            }

            shape.x = matrix[0];
            shape.y = matrix[1];
            shape.width = shape.width * Math.abs(scaleX);
            shape.height = shape.height * Math.abs(scaleY);

            return shape;
        }


        return adjustShape;
    }
);