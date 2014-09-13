/**
 * @file getAngle.js
 * @author mengke01
 * @date 
 * @description
 * 获取向量夹角，带方向
 */


define(
    function(require) {

        /**
         * 获取向量夹角, 相对于坐标原点
         * 
         * @param {number} x1 起始x
         * @param {number} y1 起始y
         * @param {number} x2 结束x
         * @param {number} y2 结束y
         * @return {number} 弧度
         */
        function getAngle(x1, y1, x2, y2) {
            // cos(θ) = (x1x2+y1y2)/[√(x1²+y1²)*√(x2²+y2²)]
            var angle = Math.acos( (x1 * x2 + y1 * y2) / Math.sqrt(x1*x1 + y1*y1) / Math.sqrt(x2*x2 + y2*y2));

            // 有向线段内积，判断左右
            //(xb - xa) * (yc - ya) - (xc - xa) * (yb - ya);
            if (x1 * y2 - x2 * y1 < 0) {
                angle = 2 * Math.PI - angle;
            }

            return angle;
        }

        return getAngle;
    }
);
