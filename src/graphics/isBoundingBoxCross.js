/**
 * @file isBoundingBoxCross.js
 * @author mengke01
 * @date 
 * @description
 * 两个boundingbox的关系
 */


define(
    function(require) {
        
        /**
         * 判断点是否在bounding box内部
         * 
         * @return {boolean} 是否
         */
        function isPointInBounding(bound, p) {
            return p.x <= bound.x + bound.width 
                && p.x >= bound.x
                && p.y <= bound.y + bound.height
                && p.y >= bound.y
        }

        /**
         * 两个boundingbox的关系
         * 
         * @param {Object} b1 bounding 1
         * @param {Object} b2 bounding 2
         * @return {number} 包含关系
         */
        function isBoundingBoxCross(b1, b2) {
            var b1_lt = isPointInBounding(b2, b1); // 左上
            var b1_rt = isPointInBounding(b2, {x: b1.x + b1.width, y: b1.y}); // 右上
            var b1_lb = isPointInBounding(b2, {x: b1.x, y: b1.y + b1.height}); // 左下
            var b1_rb = isPointInBounding(b2, {x: b1.x + b1.width, y: b1.y + b1.height}); //右下

            var b2_lt = isPointInBounding(b1, b2); // 左上
            var b2_rt = isPointInBounding(b1, {x: b2.x + b2.width, y: b2.y}); // 右上
            var b2_lb = isPointInBounding(b1, {x: b2.x, y: b2.y + b2.height}); // 左下
            var b2_rb = isPointInBounding(b1, {x: b2.x + b2.width, y: b2.y + b2.height}); //右下

            // 无交点
            if(false == (b1_lt || b1_rt || b1_lb || b1_rb || b2_lt || b2_rt || b2_lb || b2_rb)) {
                return false;
            }
            // b2 包含 b1
            else if (b1_lt && b1_rt && b1_lb && b1_rb) {
                return 2;
            }
            // b1 包含 b2
            else if (b2_lt && b2_rt && b2_lb && b2_rb) {
                return 3;
            }
            // 有交点
            else {
                return 1;
            }
        }

        return isBoundingBoxCross;
    }
);
