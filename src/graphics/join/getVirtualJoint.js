/**
 * @file getVirtualJoint.js
 * @author mengke01
 * @date
 * @description
 * 检查虚交点，只有交点没有相交路径的情况
 */


define(
    function (require) {
        var isInsidePath = require('../isInsidePath');
        var getBezierQ2Point = require('math/getBezierQ2Point');

        /* eslint-disable fecs-max-statements */
        /**
         * 检查虚交点，只有交点没有相交路径的情况
         * 此处需要注意，仅对插值后的路径进行检查，否则会出现错误
         *
         * 此方法会出现大量误判点
         * FIXME 向量法判断虚交点
         * 优化方法：
         * 如果不是顶点相交，则用切线法判断比较准确
         * 如果是顶点相交则用向量法判断
         *
         * @param {Array} path0 路径0
         * @param {Array} path1 路径1
         * @param {Array} joint 交点集合
         * @return {Object} 虚交点情况
         */
        function getVirtualJoint(path0, path1, joint) {

            if (!joint) {
                return {};
            }

            var outCount = 0; // 交点在另一路径外部
            var inCount = 0; // 交点在另一路径内部
            var virtualPoints = []; // 虚交点数组
            var prevIndex = -1; // 上一个交点的索引

            joint.forEach(function (p) {
                var index = p.index0;

                // 同一个路径段上有两个交点，则必定不是虚交点
                if (index === prevIndex) {
                    return;
                }

                var cur = index;
                var next = index === path0.length - 1 ? 0 : index + 1;
                var prev = index === 0 ? path0.length - 1 : index - 1;

                var curPoint = path0[cur];
                var nextPoint = path0[next];
                var prevPoint = path0[prev];
                var b0;
                var b1;
                var b2;
                var p2;
                var ip1;
                var ip2;

                // 本路径段是直线
                if (curPoint.onCurve) {
                    b1 = isInsidePath(path1, {x: (curPoint.x + p.x) / 2, y: (curPoint.y + p.y) / 2});
                    b2 = isInsidePath(path1, {x: (nextPoint.x + p.x) / 2, y: (nextPoint.y + p.y) / 2});

                    // 起点终点都在外部
                    if (!b1 && !b2) {
                        outCount++;
                        p.virtual = true;
                        virtualPoints.push(p);
                    }
                    // 起点在上面
                    else if (Math.abs(cur.x - p.x) < 0.01 && Math.abs(cur.y - p.y) < 0.01) {

                        // 上一个路径段是bezier曲线
                        if (!prevPoint.onCurve) {
                            ip2 = prev - 1 === 0 ? path0.length - 1 : prev - 1;
                            p2 = path0[ip2];
                            // bezier曲线连续的情况
                            if (!p2.onCurve) {
                                p2 = {x: (prevPoint.x + p2.x) / 2, y: (prevPoint.y + p2.y) / 2};
                            }
                            // 取bezier曲线终点
                            prevPoint = getBezierQ2Point(curPoint, prevPoint, p2, 0.5);
                        }

                        b0 = isInsidePath(path1, prevPoint);

                        if (b0 && b2) {
                            inCount++;
                            p.virtual = true;
                            virtualPoints.push(p);
                        }
                        else if (!b0 && !b2) {
                            outCount++;
                            p.virtual = true;
                            virtualPoints.push(p);
                        }
                    }
                }
                // bezier曲线
                else {

                    // 起点在路径上, 需要同时判断本路径和上一路径的交点情况
                    if (Math.abs(prevPoint.x - p.x) < 0.01 && Math.abs(prevPoint.y - p.y) < 0.01) {
                        b2 = isInsidePath(path1, getBezierQ2Point(prevPoint, curPoint, nextPoint, 0.5));
                        ip1 = prev - 1 === 0 ? path0.length - 1 : prev - 1;
                        // 直线
                        if (path0[ip1].onCurve) {
                            b0 = isInsidePath(path1, path0[ip1]);
                        }
                        else {
                            ip2 = ip1 - 1 === 0 ? path0.length - 1 : ip1 - 1;
                            b0 = isInsidePath(
                                path1,
                                getBezierQ2Point(prevPoint, path0[ip1], path0[ip2], 0.5)
                            );
                        }
                    }

                    // 不在路径上只需要判断是否都在外面或者里面
                    else {
                        b0 = isInsidePath(path1, prevPoint);
                        b2 = isInsidePath(path1, nextPoint);
                    }

                    if (b0 && b2) {
                        inCount++;
                        virtualPoints.push(p);
                    }
                    else if (!b0 && !b2) {
                        outCount++;
                        virtualPoints.push(p);
                    }
                }

                prevIndex = index;
            });

            return {
                inCount: inCount,
                outCount: outCount,
                points: virtualPoints
            };
        }
        /* eslint-enable fecs-max-statements */

        return getVirtualJoint;
    }
);
