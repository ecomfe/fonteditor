/**
 * @file isBezierCross.js
 * @author mengke01
 * @date 
 * @description
 * 求两个bezier曲线的交点
 */


define(
    function(require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var isBoundingBoxCross = require('./isBoundingBoxCross');
        var bezierQuadeEquation = require('./bezierQuadeEquation');


        /**
         * 求两个bezier曲线的交点
         */
        function isBezierCross(p0, p1, p2, t0, t1, t2) {
            // t二项式系数
            // a = p0 + p2 - 2p1
            // b = 2(p1 - p0)
            // c = p0
            var bounding1 = computeBoundingBox.quadraticBezier(p0, p1, p2);
            var bounding2 = computeBoundingBox.quadraticBezier(t0, t1, t2);

            // 包围盒是否有交点
            if(isBoundingBoxCross(bounding1, bounding2)) {

                // 求解x二项式系数
                var p0x = p0.x - t0.x;
                var p1x = p1.x - t1.x;
                var p2x = p2.x - t2.x;

                var ax = p0x  + p2x - 2 * p1x;
                var bx = 2 * (p1x - p0x);
                var cx = p0x;

                var txResult = bezierQuadeEquation(ax, bx, cx);

                console.log(txResult);
                
                // x轴无交点
                // if(!txResult) {
                //     return false;
                // }

                var p0y = p0.y - t0.y;
                var p1y = p1.y - t1.y;
                var p2y = p2.y - t2.y;

                var ay = p0y  + p2y - 2 * p1y;
                var by = 2 * (p1y - p0y);
                var cy = p0y;

                var tyResult = bezierQuadeEquation(ay, by, cy);


                console.log(tyResult);

            }

            return false;
        }


        return isBezierCross;
    }
);
