/**
 * @file getArc.js
 * @author mengke01
 * @date 
 * @description
 * 获取椭圆弧度
 */

define(
    function(require) {
        
        var computeBoundingBox = require('./computeBoundingBox');
        var pathSplit = require('./join/pathSplit');
        var pathJoin = require('./pathJoin');
        var pathAdjust = require('./pathAdjust');
        var pathRotate = require('./pathRotate');
        var quadraticEquation = require('math/quadraticEquation');
        var lang = require('common/lang');
        var isPathCross = require('./isPathCross');
        var interpolate = require('./join/interpolate');
        var deInterpolate = require('./join/deInterpolate');
        var getJoint = require('./join/getJoint');
        var pathSplit = require('./join/pathSplit');


        // 圆路径
        var PATH_CIRCLE = [
            {"x":383,"y":0},{"x":207,"y":75},{"x":75,"y":208},{"x":0,"y":384},{"x":0,"y":583},{"x":75,"y":760},
            {"x":207,"y":891},{"x":383,"y":966},{"x":582,"y":966},{"x":758,"y":891},{"x":890,"y":760},
            {"x":965,"y":583},{"x":965,"y":384},{"x":890,"y":208},{"x":758,"y":75},{"x":582,"y":0}
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

            // Compute the center
            // see librsvg
            var f = angle * Math.PI / 180.0;
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

            
            k1 = rx * rx * y1_ * y1_ + ry * ry * x1_ * x1_;
            if(k1 == 0) {
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


            var ovalPath = interpolate(getOval(2 * rx, 2 * ry, f, {x: cx, y: cy}));

            // 将线段放大，防止无交点
            cx = (p0.x + p1.x) / 2;
            cy = (p0.y + p1.y) / 2;
            pathAdjust([p0, p1], 1.1, 1.1, -cx, -cy);
            pathAdjust([p0, p1], 1, 1, cx, cy);

            var result = getJoint(ovalPath, 'L', p0, p1, 0, 0);

            // 这里没有支持实际弦长比较大，需要缩放椭圆的情况，
            // 不会算。。囧
            // TODO
            if (result) {
                ovalPath = pathSplit(ovalPath, result.map(function(p) {
                    p.index = p.index1;
                    return p;
                })).sort(function(a, b) {
                    return a.length - b.length;
                });

                ovalPath = largeArc ? ovalPath[1] : ovalPath[0];
                var end = ovalPath[ovalPath.length - 1];

                // 翻转
                if (Math.abs(p0.x - end.x) < 0.01 && Math.abs(p0.y - end.y) < 0.01) {
                    ovalPath = ovalPath.reverse();
                }

                return deInterpolate(ovalPath);
            }
            else {
                console.warn('arc convert error!');
                return [p0, p1];
            }
        }




        return getArc;
    }
);

