/**
 * @file isInsidePath.js
 * @author mengke01
 * @date 
 * @description
 * 判断点是否在path内部，射线法
 * TrueType uses the non-zero winding number rule.
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM01/Chap1.html
 */


define(
    function(require) {
        var isBezierRayCross = require('./isBezierRayCross');
        var isSegmentRayCross = require('./isSegmentRayCross');

        /**
         * 判断点是否在path内部
         * 以p点的x轴向右射线为起点
         * 
         * @param {Object} path path对象
         * @param {Object} p 点对象
         * @return {boolean} 是否
         */
        function isInsidePath(path, p) {
            var i = -1;
            var l = path.length;
            var prev, cur, point;
            var zCount = 0; 

            while (++i < l) {
                point = path[i];
                switch (point.c) {
                    case 'M':
                        prev = point.p;
                        break;

                    case 'L':
                        var joint = null;
                        if(joint = isSegmentRayCross(prev, point.p, p)) {

                            // 在直线上
                            if(joint[0].x == p.x) {
                                return true;
                            }

                            if(point.p.y > prev.y) {
                                zCount++;
                            }
                            else {
                                zCount--;
                            }
                        }
                        prev = point.p;

                        break;

                    case 'Q':
                        var joint = p1 = p2 = null;
                        
                        if(joint = isBezierRayCross(prev, point.p1, point.p, p)) {
                            
                            // 在曲线上
                            if(joint[0].x == p.x || joint[1] && joint[1].x == p.x) {
                                return true;
                            }

                            if (joint.length == 2) {
                                break;
                            }
                            
                            joint = joint[0];

                            if(joint.y > prev.y && joint.y < point.p1.y) {
                                p1 = prev;
                                p2 =  point.p1;
                            }
                            else {
                                p1 = point.p1;
                                p2 =  point.p;
                            }

                            if(p2.y > p1.y) {
                                zCount++;
                            }
                            else {
                                zCount--;
                            }

                        }
                        prev = point.p;
                        break;
                }
            }

            return !!zCount;
        }

        return isInsidePath;
    }
);
