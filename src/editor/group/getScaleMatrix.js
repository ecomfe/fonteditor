/**
 * @file getScaleMatrix.js
 * @author mengke01
 * @date 
 * @description
 * 获得变换的矩阵
 */


define(
    function(require) {


        /**
         * 获得变换矩阵
         * 
         * @param {number} pos 变换位置
         * @param {Object} bound 边界
         * @param {Object} camera 镜头对象
         * @return {Array} 变换矩阵，x,y,xScale,yScale
         */
        function getScaleMatrix(pos, bound, camera) {

            // x, y, xscale 相对符号, yscale 相对符号
            var matrix = [
                0, 
                0, 
                1,
                1
            ];

            switch (pos) {
                case 1:
                    matrix[0] = bound.x + bound.width;
                    matrix[1] = bound.y + bound.height;
                    matrix[2] = -(camera.x - matrix[0]) / bound.width;
                    matrix[3] = -(camera.y - matrix[1]) / bound.height;
                    break;
                case 2:
                    matrix[0] = bound.x;
                    matrix[1] = bound.y + bound.height;
                    matrix[2] = (camera.x - matrix[0]) / bound.width;
                    matrix[3] = -(camera.y - matrix[1]) / bound.height;
                    break;

                case 3:
                    matrix[0] = bound.x;
                    matrix[1] = bound.y;
                    matrix[2] = (camera.x - matrix[0]) / bound.width;
                    matrix[3] = (camera.y - matrix[1]) / bound.height;
                    break;

                case 4:
                    matrix[0] = bound.x + bound.width;
                    matrix[1] = bound.y;
                    matrix[2] = -(camera.x - matrix[0]) / bound.width;
                    matrix[3] = (camera.y - matrix[1]) / bound.height;
                    break;

                case 5:
                    matrix[1] = bound.y + bound.height;
                    matrix[2] = 1;
                    matrix[3] = -(camera.y - matrix[1]) / bound.height;
                    break;

                case 7:
                    matrix[1] = bound.y;
                    matrix[3] = (camera.y - matrix[1]) / bound.height;
                    break;

                case 6:
                    matrix[0] = bound.x;
                    matrix[2] = (camera.x - matrix[0]) / bound.width;
                    break;

                case 8: 
                    matrix[0] = bound.x + bound.width;
                    matrix[2] = -(camera.x - matrix[0]) / bound.width;
                    break;
            }

            return matrix;
        }


        return getScaleMatrix;
    }
);
