/**
 * @file svg path转换为轮廓
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var bezierCubic2Q2 = require('math/bezierCubic2Q2');
    var getArc =  require('graphics/getArc');
    var parseParams = require('./parseParams');
    var reducePath = require('graphics/reducePath');

    /**
     * 三次贝塞尔曲线，转二次贝塞尔曲线
     *
     * @param {Array} cubicList 三次曲线数组
     * @param {Array} contour 当前解析后的轮廓数组
     * @return {Array} 当前解析后的轮廓数组
     */
    function cubic2Points(cubicList, contour) {

        var i;
        var l;
        var q2List = [];

        cubicList.forEach(function (c) {
            var list = bezierCubic2Q2(c[0], c[1], c[2], c[3]);
            for (i = 0, l = list.length; i < l; i++) {
                q2List.push(list[i]);
            }
        });

        var q2;
        var prevq2;
        for (i = 0, l = q2List.length; i < l; i++) {
            q2 = q2List[i];
            if (i === 0) {
                contour.push({
                    x: q2[1].x,
                    y: q2[1].y
                });
                contour.push({
                    x: q2[2].x,
                    y: q2[2].y,
                    onCurve: true
                });
            }
            else {
                prevq2 = q2List[i - 1];
                // 检查是否存在切线点
                if (
                    prevq2[1].x + q2[1].x === 2 * q2[0].x
                    && prevq2[1].y + q2[1].y === 2 * q2[0].y
                ) {
                    contour.pop();
                }
                contour.push({
                    x: q2[1].x,
                    y: q2[1].y
                });
                contour.push({
                    x: q2[2].x,
                    y: q2[2].y,
                    onCurve: true
                });
            }
        }

        contour.push({
            x: q2[2].x,
            y: q2[2].y,
            onCurve: true
        });

        return contour;
    }


    /**
     * svg 命令数组转轮廓
     *
     * @param {Array} segments svg 命令数组
     * @return {Array} 轮廓数组
     */
    function segments2Contours(segments) {

        // 解析segments
        var contours = [];
        var contour = [];
        var prevX = 0;
        var prevY = 0;
        var segment;
        var args;
        var cmd;
        var relative;
        var q;
        var ql;
        var px;
        var py;
        var cubicList;
        var p1;
        var p2;
        var c1;
        var c2;
        var prevCubicC1; // 三次贝塞尔曲线前一个控制点，用于绘制`s`命令

        for (var i = 0, l = segments.length; i < l; i++) {
            segment = segments[i];
            cmd = segment.cmd;
            relative = segment.relative;
            args = segment.args;

            if (cmd === 'Z') {
                contours.push(contour);
                contour = [];
            }
            else if (cmd === 'M') {
                if (relative) {
                    prevX += args[0];
                    prevY += args[1];
                }
                else {
                    prevX = args[0];
                    prevY = args[1];
                }

                contour.push({
                    x: prevX,
                    y: prevY,
                    onCurve: true
                });
            }
            else if (cmd === 'H') {

                if (relative) {
                    prevX += args[0];
                }
                else {
                    prevX = args[0];
                }

                contour.push({
                    x: prevX,
                    y: prevY,
                    onCurve: true
                });
            }
            else if (cmd === 'V') {

                if (relative) {
                    prevY += args[0];
                }
                else {
                    prevY = args[0];
                }

                contour.push({
                    x: prevX,
                    y: prevY,
                    onCurve: true
                });
            }
            else if (cmd === 'L') {

                // 这里可能会连续绘制，最后一个是终点
                if (relative) {
                    px = prevX;
                    py = prevY;
                }
                else {
                    px = 0;
                    py = 0;
                }

                for (q = 0, ql = args.length; q < ql; q += 2) {

                    if (relative) {
                        px += args[q];
                        py += args[q + 1];
                    }
                    else {
                        px = args[q];
                        py = args[q + 1];
                    }

                    contour.push({
                        x: px,
                        y: py,
                        onCurve: true
                    });
                }

                prevX = px;
                prevY = py;

            }
            // 二次贝塞尔
            else if (cmd === 'Q') {

                // 这里可能会连续绘制，最后一个是终点
                if (relative) {
                    px = prevX;
                    py = prevY;
                }
                else {
                    px = 0;
                    py = 0;
                }

                for (q = 0, ql = args.length; q < ql; q += 4) {

                    contour.push({
                        x: px + args[q],
                        y: py + args[q + 1]
                    });
                    contour.push({
                        x: px + args[q + 2],
                        y: py + args[q + 3],
                        onCurve: true
                    });

                    if (relative) {
                        px += args[q + 2];
                        py += args[q + 3];
                    }
                    else {
                        px = 0;
                        py = 0;
                    }
                }

                if (relative) {
                    prevX = px;
                    prevY = py;
                }
                else {
                    prevX = args[ql - 2];
                    prevY = args[ql - 1];
                }
            }
            // 二次贝塞尔平滑
            else if (cmd === 'T') {

                // 这里需要移除上一个曲线的终点
                var last = contour.pop();

                var pc = contour[contour.length - 1];

                contour.push(pc = {
                    x: 2 * last.x - pc.x,
                    y: 2 * last.y - pc.y
                });

                px = prevX;
                py = prevY;

                for (q = 0, ql = args.length - 2; q < ql; q += 2) {

                    if (relative) {
                        px += args[q];
                        py += args[q + 1];
                    }
                    else {
                        px = args[q];
                        py = args[q + 1];
                    }

                    last = {
                        x: px,
                        y: py
                    };

                    contour.push(pc = {
                        x: 2 * last.x - pc.x,
                        y: 2 * last.y - pc.y
                    });
                }

                if (relative) {
                    prevX = px + args[ql];
                    prevY = py + args[ql + 1];
                }
                else {
                    prevX = args[ql];
                    prevY = args[ql + 1];
                }

                contour.push({
                    x: prevX,
                    y: prevY,
                    onCurve: true
                });

            }
            // 三次贝塞尔
            else if (cmd === 'C') {

                // 这里可能会连续绘制，最后一个是终点
                cubicList = [];

                if (relative) {
                    px = prevX;
                    py = prevY;
                }
                else {
                    px = 0;
                    py = 0;
                }

                p1 = {
                    x: prevX,
                    y: prevY
                };

                for (q = 0, ql = args.length; q < ql; q += 6) {

                    c1 = {
                        x: px + args[q],
                        y: py + args[q + 1]
                    };

                    c2 = {
                        x: px + args[q + 2],
                        y: py + args[q + 3]
                    };

                    p2 = {
                        x: px + args[q + 4],
                        y: py + args[q + 5]
                    };

                    cubicList.push([p1, c1, c2, p2]);

                    p1 = p2;

                    if (relative) {
                        px += args[q + 4];
                        py += args[q + 5];
                    }
                    else {
                        px = 0;
                        py = 0;
                    }
                }

                if (relative) {
                    prevX = px;
                    prevY = py;
                }
                else {
                    prevX = args[ql - 2];
                    prevY = args[ql - 1];
                }

                cubic2Points(cubicList, contour);
                prevCubicC1 = cubicList[cubicList.length - 1][2];
            }
            // 三次贝塞尔平滑
            else if (cmd === 'S') {

                // 这里可能会连续绘制，最后一个是终点
                cubicList = [];

                if (relative) {
                    px = prevX;
                    py = prevY;
                }
                else {
                    px = 0;
                    py = 0;
                }

                // 这里需要移除上一个曲线的终点
                p1 = contour.pop();
                c1 = {
                    x: 2 * p1.x - prevCubicC1.x,
                    y: 2 * p1.y - prevCubicC1.y
                };

                for (q = 0, ql = args.length; q < ql; q += 4) {

                    c2 = {
                        x: px + args[q],
                        y: py + args[q + 1]
                    };

                    p2 = {
                        x: px + args[q + 2],
                        y: py + args[q + 3]
                    };

                    cubicList.push([p1, c1, c2, p2]);

                    p1 = p2;

                    c1 = {
                        x: 2 * p1.x - c2.x,
                        y: 2 * p1.y - c2.y
                    };

                    if (relative) {
                        px += args[q + 2];
                        py += args[q + 3];
                    }
                    else {
                        px = 0;
                        py = 0;
                    }
                }

                if (relative) {
                    prevX = px;
                    prevY = py;
                }
                else {
                    prevX = args[ql - 2];
                    prevY = args[ql - 1];
                }

                cubic2Points(cubicList, contour);
                prevCubicC1 = cubicList[cubicList.length - 1][2];
            }
            // 求弧度, rx, ry, angle, largeArc, sweep, ex, ey
            else if (cmd === 'A') {

                if (args.length !== 7) {
                    throw 'arc command params error:' + args.join(',');
                }

                var ex = args[5];
                var ey = args[6];

                if (relative) {
                    ex = prevX + ex;
                    ey = prevY + ey;
                }

                var path = getArc(
                    args[0], args[1],
                    args[2], args[3], args[4],
                    {x: prevX, y: prevY},
                    {x: ex, y: ey}
                );

                if (path && path.length > 1) {
                    for (q = 1, ql = path.length; q < ql; q++) {
                        contour.push(path[q]);
                    }
                }

                prevX = ex;
                prevY = ey;
            }
        }

        return contours;
    }

    /**
     * svg path转轮廓
     *
     * @param {string} path svg的path字符串
     * @return {Array} 转换后的轮廓
     */
    function path2contours(path) {

        if (!path || !path.length) {
            return null;
        }

        path = path.trim();

        if (path[0] !== 'M' && path[0] !== 'm') {
            path = 'M 0 0' + path;
        }

        var last = path.length - 1;
        if (path[last] !== 'Z' && path[last] !== 'z') {
            path += 'Z';
        }

        // 获取segments
        var segments = [];
        var cmd;
        var relative = false;
        var lastIndex;
        var args;

        for (var i = 0, l = path.length; i < l; i++) {
            var c = path[i].toUpperCase();
            var r = c !== path[i];

            switch (c) {
                case 'M':
                    /*jshint -W086 */
                    if (i === 0) {
                        cmd = c;
                        lastIndex = 1;
                        break;
                    }
                case 'Q':
                case 'T':
                case 'C':
                case 'S':
                case 'H':
                case 'V':
                case 'L':
                case 'A':
                case 'Z':
                    if (cmd === 'Z') {
                        segments.push({cmd: 'Z'});
                    }
                    else {
                        args = path.slice(lastIndex, i);
                        segments.push({
                            cmd: cmd,
                            relative: relative,
                            args: parseParams(args)
                        });
                    }

                    cmd = c;
                    relative = r;
                    lastIndex = i + 1;
                    break;

            }
        }

        segments.push({cmd: 'Z'});

        return segments2Contours(segments);
    }

    return path2contours;
});
