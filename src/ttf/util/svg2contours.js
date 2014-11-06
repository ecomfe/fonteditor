/**
 * @file svg2contours.js
 * @author mengke01
 * @date 
 * @description
 * svg d 转换为contours
 */


define(
    function(require) {

        var bezierCubic2Q2 = require('math/bezierCubic2Q2');


        /**
         * 三次贝塞尔曲线列表，转二次贝塞尔曲线列表
         * 
         * @param {Array} cubicList 三次曲线列表
         * @param {Array} contour 轮廓列表
         * @return {Array} 轮廓列表
         */
        function cubic2Points(cubicList, contour) {

            var q2List = [];
            cubicList.forEach(function(c) {
                q2List = q2List.concat(bezierCubic2Q2(c[0], c[1], c[2], c[3]));
            });

            var q2, prevq2;
            for (var i = 0, l = q2List.length; i < l; i++) {
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
                    if (prevq2[1].x + q2[1].x == 2 * q2[0].x && prevq2[1].y + q2[1].y == 2 * q2[0].y) {
                        contour.pop();
                    }
                    contour.push({
                        x: q2[1].x,
                        y: q2[1].y
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
         * svg path 转 contours
         * 
         * @param {string} path path对象
         * @return {Array} contours
         */
        function svg2contours(path) {
            
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

            var argsMap = function(d) {
                return +d.trim();
            };

            // 获取segments
            var segments = [];
            var cmd, relative = false, c, r, lastIndex, args, segReg = /\-?\d+(?:\.\d+)?\b/g;
            for (var i = 0, l = path.length;i < l; i++) {
                c = path[i].toUpperCase();
                r = c != path[i];
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
                    case 'Z':
                        if (cmd == 'Z') {
                            segments.push({cmd:'Z'});
                        }
                        else {
                            args = path.slice(lastIndex, i);
                            segments.push({
                                cmd: cmd,
                                relative: relative,
                                args: args.match(segReg).map(argsMap)
                            });
                        }

                        cmd = c;
                        relative = r;
                        lastIndex = i + 1;
                        break;
                    case 'A':
                        throw 'not support arc comand';
                }
            }

            segments.push({cmd:'Z'});

            // 解析segments
            var contours = [], contour = [], prevX = 0, prevY = 0;
            var prevCubicC1; // 三次贝塞尔曲线前一个控制点，用于绘制`s`命令

            for (var i = 0, l = segments.length;i < l; i++) {
                segment = segments[i];
                cmd = segment.cmd;
                relative = segment.relative;

                if (cmd === 'Z') {
                    contours.push(contour);
                    contour = [];
                }
                else if (cmd === 'M') {
                    if (relative) {
                        prevX += segment.args[0];
                        prevY += segment.args[1];
                    }
                    else {
                        prevX = segment.args[0];
                        prevY = segment.args[1];
                    }

                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                else if (cmd === 'H') {

                    if (relative) {
                        prevX += segment.args[0];
                    }
                    else {
                        prevX = segment.args[0];
                    }

                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                else if (cmd === 'V') {

                    if (relative) {
                        prevY += segment.args[0];
                    }
                    else {
                        prevY = segment.args[0];
                    }

                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                else if (cmd === 'L') {

                    // 这里可能会连续绘制，最后一个是终点
                    var q = 0, ql = segment.args.length, px, py;

                    if (relative) {
                        px = prevX;
                        py = prevY;
                    }

                    for (; q < ql ; q += 2) {

                        if (relative) {
                            px += segment.args[q];
                            py += segment.args[q + 1];
                        }
                        else {
                            px = segment.args[q];
                            py = segment.args[q + 1];
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
                    var q = 0, ql = segment.args.length, px, py;

                    if (relative) {
                        px = prevX;
                        py = prevY;
                    }
                    else {
                        px = 0;
                        py = 0;
                    }

                    for (; q < ql ; q += 4) {

                        contour.push({
                            x: px + segment.args[q],
                            y: py + segment.args[q + 1]
                        });
                        contour.push({
                            x: px + segment.args[q + 2],
                            y: py + segment.args[q + 3],
                            onCurve: true
                        });

                        if (relative) {
                            px += segment.args[q + 2];
                            py += segment.args[q + 3];
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
                        prevX = segment.args[ql - 2];
                        prevY = segment.args[ql - 1];
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

                    var q = 0, ql = segment.args.length - 2, px = prevX, py = prevY;

                    for (; q < ql ; q += 2) {

                        if (relative) {
                            px += segment.args[q];
                            py += segment.args[q + 1];
                        }
                        else {
                            px = segment.args[q];
                            py = segment.args[q + 1];
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
                        prevX = px + segment.args[ql];
                        prevY = py + segment.args[ql + 1];
                    }
                    else {
                        prevX = segment.args[ql];
                        prevY = segment.args[ql + 1];
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
                    var q = 0, ql = segment.args.length, px = 0, py = 0;
                    var cubicList = [];

                    if (relative) {
                        px = prevX;
                        py = prevY;
                    }
                    else {
                        px = 0;
                        py = 0;
                    }
                    
                    var p1 = {
                        x: prevX,
                        y: prevY
                    };

                    for (; q < ql ; q += 6) {

                        var c1 = {
                            x: px + segment.args[q],
                            y: py + segment.args[q + 1]
                        };

                        var c2 = {
                            x: px + segment.args[q + 2],
                            y: py + segment.args[q + 3]
                        };

                        var p2 = {
                            x: px + segment.args[q + 4],
                            y: py + segment.args[q + 5]
                        };

                        cubicList.push([p1, c1, c2, p2]);

                        p1 = p2;

                        if (relative) {
                            px += segment.args[q + 4];
                            py += segment.args[q + 5];
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
                        prevX = segment.args[ql - 2];
                        prevY = segment.args[ql - 1];
                    }

                    cubic2Points(cubicList, contour);
                    prevCubicC1 = cubicList[cubicList.length - 1][2];
                }
                // 三次贝塞尔平滑
                else if (cmd === 'S') {
                    
                    // 这里可能会连续绘制，最后一个是终点
                    var q = 0, ql = segment.args.length, px = 0, py = 0;
                    var cubicList = [];

                    if (relative) {
                        px = prevX;
                        py = prevY;
                    }
                    else {
                        px = 0;
                        py = 0;
                    }
                    
                    // 这里需要移除上一个曲线的终点
                    var p1 = contour.pop();
                    var c1 = {
                        x: 2 * p1.x - prevCubicC1.x,
                        y: 2 * p1.y - prevCubicC1.y
                    };

                    for (; q < ql ; q += 4) {

                        var c2 = {
                            x: px + segment.args[q],
                            y: py + segment.args[q + 1]
                        };

                        var p2 = {
                            x: px + segment.args[q + 2],
                            y: py + segment.args[q + 3]
                        };

                        cubicList.push([p1, c1, c2, p2]);

                        p1 = p2;

                        c1 = {
                            x: 2 * p1.x - c2.x,
                            y: 2 * p1.y - c2.y
                        };

                        if (relative) {
                            px += segment.args[q + 2];
                            py += segment.args[q + 3];
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
                        prevX = segment.args[ql - 2];
                        prevY = segment.args[ql - 1];
                    }

                    cubic2Points(cubicList, contour);
                    prevCubicC1 = cubicList[cubicList.length - 1][2];
                }
            }

            return contours;
        }



        return svg2contours;
    }
);
