/**
 * @file getRotateMatrix.js
 * @author mengke01
 * @date 
 * @description
 * 获得变换的矩阵
 */


define(
    function(require) {

        var getAngle = require('math/getAngle');


        /**
         * 获得变换矩阵
         * 
         * @param {number} pos 变换位置
         * @param {Object} bound 边界
         * @param {Object} camera 镜头对象
         * @return {Array} 变换矩阵，x,y,xScale,yScale
         */
        function getRotateMatrix(pos, bound, camera) {

            // x, y, xscale 相对符号, yscale 相对符号
            var matrix = [
                bound.x + bound.width / 2, 
                bound.y + bound.height / 2, 
                0
            ];

            switch (pos) {
                case 1:
                case 2:
                case 3:
                case 4:
                    matrix[2] = getAngle(
                        camera.startX - matrix[0], camera.startY - matrix[1],
                        camera.x - matrix[0], camera.y - matrix[1]
                    );
                    return matrix;

                case 5:
                    matrix[0] = 0;
                    matrix[1] = bound.y + bound.height;
                    matrix[2] = getAngle(
                        0, bound.height,
                        camera.x - camera.startX, bound.height
                    );
                    return matrix;
                case 7:
                    matrix[0] = 0;
                    matrix[1] = bound.y;
                    matrix[2] = getAngle(
                        0, -bound.height,
                        camera.x - camera.startX, -bound.height
                    );
                    return matrix;
                case 6:
                    matrix[0] = bound.x;
                    matrix[1] = 0;
                    matrix[2] = getAngle(
                        bound.width, 0,
                        bound.width, camera.y - camera.startY
                    );
                    return matrix;
                case 8: 
                    matrix[0] = bound.x + bound.width;
                    matrix[1] = 0;
                    matrix[2] = getAngle(
                        -bound.width, 0,
                        -bound.width, camera.y - camera.startY
                    );
                    return matrix;
            }

            return matrix;
        }


        return getRotateMatrix;
    }
);
