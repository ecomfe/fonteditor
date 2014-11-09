/**
 * @file getArc.js
 * @author mengke01
 * @date 
 * @description
 * 获取椭圆弧度
 * 
 * references:
 * http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
 */

define(
    function(require) {
        
        var computeBoundingBox = require('./computeBoundingBox');
        var pathSplit = require('./join/pathSplit');
        var pathJoin = require('./pathJoin');
        var pathAdjust = require('./pathAdjust');
        var pathRotate = require('./pathRotate');
        var quadraticEquation = require('math/quadraticEquation');
        var isPathCross = require('./isPathCross');
        var interpolate = require('./join/interpolate');
        var deInterpolate = require('./join/deInterpolate');
        var getJoint = require('./join/getJoint');
        var pathSplit = require('./join/pathSplit');
        var lang = require('common/lang');

        // 圆路径，逆时针
        var PATH_CIRCLE =[
            {"x":582,"y":0},{"x":758,"y":75},{"x":890,"y":208},{"x":965,"y":384},{"x":965,"y":583},{"x":890,"y":760},
            {"x":758,"y":891},{"x":582,"y":966},{"x":383,"y":966},{"x":207,"y":891},{"x":75,"y":760},{"x":0,"y":583},
            {"x":0,"y":384},{"x":75,"y":208},{"x":207,"y":75},{"x":383,"y":0}
        ];

        /**
         * 获取椭圆形状
         * 
         * @param {number} rx x轴长度
         * @param {number} ry y轴长度
         * @param {number} angle 旋转角度
         * @param {Object} center 中心点
         * @return {Array} 椭圆形状
         */
        function getOval(rx, ry, angle, center) {
            var path = lang.clone(PATH_CIRCLE);

            var bound = computeBoundingBox.computePath(path);
            var scaleX = rx / bound.width;

            pathAdjust(path, 1, 1, -(bound.x + bound.width / 2), -(bound.y + bound.height / 2));
            pathAdjust(path, scaleX, scaleX * ry / rx);
            pathRotate(path, angle);
            pathAdjust(path, 1, 1, center.x, center.y);

            return path;
        }

        /**
         * 获取椭圆弧度
         * 
         * @param {number} rx 椭圆长半轴
         * @param {number} ry 椭圆短半轴
         * @param {number} angle 旋转角度
         * @param {Object} p0 分割点1
         * @param {Object} p1 分割点2
         * @return {Array} 分割后的路径
         */
        function getArc(rx, ry, angle, largeArc, sweep, p0, p1) {

            if (rx === 0 || ry === 0) {
                return [p0, p1];
            }

            // Compute the center
            // see librsvg
            var f = (angle % 360) * Math.PI / 180.0;
            var sinf = Math.sin(f);
            var cosf = Math.cos(f);

            if (rx < 0) {
                rx = -rx;
            }

            if (ry < 0) {
                ry = -ry;
            }
            var x1 = p0.x;
            var y1 = p0.y;
            var x2 = p1.x;
            var y2 = p1.y;
            var k1 = (x1 - x2) / 2;
            var k2 = (y1 - y2) / 2;
            var x1_ = cosf * k1 + sinf * k2;
            var y1_ = -sinf * k1 + cosf * k2;

            // scale rx, ry
            var ita = Math.sqrt(Math.pow(x1_ / rx, 2)+ Math.pow(y1_ / ry, 2));
            if (ita > 1) {
                rx = ita * rx;
                ry = ita * ry;
            }

            
            k1 = rx * rx * y1_ * y1_ + ry * ry * x1_ * x1_;
            if(k1 === 0) {
                return [];
            }

            k1 = Math.sqrt(Math.abs((rx * rx * ry * ry) / k1 - 1));

            if(sweep == largeArc) {
                k1 = -k1;
            }

            var cx_ = k1 * rx * y1_ / ry;
            var cy_ = -k1 * ry * x1_ / rx;
            
            var cx = cosf * cx_ - sinf * cy_ + (x1 + x2) / 2;
            var cy = sinf * cx_ + cosf * cy_ + (y1 + y2) / 2;



            var p0_ = {x: x1, y: y1};
            var p1_ = {x: x2, y: y2};

            // 将线段放大，防止无交点
            cx = (p0_.x + p1_.x) / 2;
            cy = (p0_.y + p1_.y) / 2;
            pathAdjust([p0_, p1_], 1.1, 1.1, -cx, -cy);
            pathAdjust([p0_, p1_], 1, 1, cx, cy);

            // 这里弧度有负向的情况，需要转换成正向
            var ovalPath = interpolate(getOval(2 * rx, 2 * ry, f > 0 ? f : (f + Math.PI), {x: cx, y: cy}));
            var result = getJoint(ovalPath, 'L', p0_, p1_, 0, 0);

            // 这里必定会有交点，如果没有，则说明计算错误
            if (result) {
                var ovalPaths = pathSplit(ovalPath, result.map(function(p) {
                    p.index = p.index1;
                    return p;
                }));

                // 弧线相等的时候需要判断 sweepflag
                var clockwise = y1 > y2 ? 1 : y1 < y2 ? -1 : (x1 > x2 ? 1 : -1);
                if (Math.abs(cx - (x1 + x2) / 2) < 0.01 && Math.abs(cy - (y1 + y2) / 2) < 0.01) {
                    // 这里需要区分相交线段是否是逆时针
                    if (sweep && clockwise == 1 || sweep == 0 && clockwise == -1) {
                        ovalPath = ovalPaths[0];
                    }
                    else {
                        ovalPath = ovalPaths[1];
                    }
                }
                else {
                    if (largeArc && ovalPaths[1].length > ovalPaths[0].length) {
                        ovalPath = ovalPaths[1];
                    }
                    else {
                        ovalPath = ovalPaths[0];
                    }  
                }
                
                ovalPath = deInterpolate(ovalPath);
                // 逆向起始点
                var end = ovalPath[ovalPath.length - 1];
                if (Math.abs(p0.x - end.x) < 0.01 && Math.abs(p0.y - end.y) < 0.01) {
                    ovalPath = ovalPath.reverse();
                }

                return ovalPath;
            }
            else {
                return [p0, p1];
            }
        }




        return getArc;
    }
);

