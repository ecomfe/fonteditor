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

        function cubic2Points(cubicList, contour) {
            // 三次贝塞尔转二次
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
                    case 'A':
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
                }
            }

            segments.push({cmd:'Z'});

            // 解析segments
            var contours = [], contour = [], prevX = 0, prevY = 0, prevc1;
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
                    var q = 0, ql = segment.args.length, px = 0, py = 0;

                    if (relative) {
                        px = prevX;
                        py = prevY;
                    }

                    for (; q < ql ; q += 2) {
                        contour.push({
                            x: px + segment.args[q],
                            y: py + segment.args[q + 1],
                            onCurve: true
                        });
                    }

                    ql = segment.args.length - 2;
                    
                    if (relative) {
                        prevX += segment.args[ql];
                        prevY += segment.args[ql + 1];
                    }
                    else {
                        prevX = segment.args[ql];
                        prevY = segment.args[ql + 1];
                    }
                }
                // 二次贝塞尔
                else if (cmd === 'Q') {
                    // 这里可能会连续绘制，最后一个是终点
                    var q = 0, ql = segment.args.length, px = 0, py = 0;

                    if (relative) {
                        px = prevX;
                        py = prevY;
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
                    }

                    ql = segment.args.length - 2;
                    if (relative) {
                        prevX += segment.args[ql];
                        prevY += segment.args[ql + 1];
                    }
                    else {
                        prevX = segment.args[ql];
                        prevY = segment.args[ql + 1];
                    }
                }
                // 二次贝塞尔平滑
                else if (cmd === 'T') {

                    // 这里需要移除上一个曲线的终点
                    var last = contour.pop();

                    var pc = contour[contour.length - 1];

                    contour.push({
                        x: 2 * last.x - pc.x,
                        y: 2 * last.y - pc.y
                    });

                    var q = 0, ql = segment.args.length - 2, px = 0, py = 0;

                    if (relative) {
                        px = prevX;
                        py = prevY;
                    }

                    for (; q < ql ; q += 2) {
                        pc = contour[contour.length - 1];
                        last = {
                            x: px + segment.args[q],
                            y: py + segment.args[q + 1]
                        };
                        contour.push({
                            x: 2 * last.x - pc.x,
                            y: 2 * last.y - pc.y
                        });
                    }

                    if (relative) {
                        prevX += segment.args[ql];
                        prevY += segment.args[ql + 1];
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
                    var q = 0, ql = segment.args.length - 2, px = 0, py = 0;
                    var cubicList = [];

                    if (relative) {
                        px = prevX;
                        py = prevY;
                    }

                    for (; q < ql ; q += 4) {
                        var cubic = [];
                        var c1 = {
                            x: px + segment.args[q],
                            y: py + segment.args[q + 1]
                        };
                        var c2 = {
                            x: px + segment.args[q + 2],
                            y: py + segment.args[q + 3]
                        };

                        // 计算中间点
                        if (q === 0) {
                            cubic.push({x: prevX, y: prevY});
                            cubic.push(c1);
                            cubic.push(c2);
                        }
                        else {
                            var prevC2 = cubicList[cubicList.length - 1][2];
                            var p1 = {
                                x: (prevC2.x + c1.x) / 2,
                                y: (prevC2.y + c1.y) / 2
                            };
                            cubicList[cubicList.length - 1][3] = p1;

                            cubic.push(p1);
                            cubic.push(c1);
                            cubic.push(c2);
                        }

                        cubicList.push(cubic);
                    }

                    if (relative) {
                        prevX += segment.args[ql];
                        prevY += segment.args[ql + 1];
                    }
                    else {
                        prevX = segment.args[ql];
                        prevY = segment.args[ql + 1];
                    }

                    cubicList[cubicList.length - 1].push({x: prevX, y: prevY});
                    cubic2Points(cubicList, contour);
                    prevc1 = cubicList[cubicList.length - 1][2];
                }
                // 三次贝塞尔平滑
                else if (cmd === 'S') {
                    
                    // TODO 这里没有支持连续的情况，有时间再搞
                    if (segment.args.length > 4) {
                        throw 'not support svg "S" command continuous!';
                    }

                    // 这里需要移除上一个曲线的终点
                    var p1 = contour.pop();
                    var c1 = {
                        x: 2 * p1.x - prevc1.x,
                        y: 2 * p1.y - prevc1.y
                    };

                    var px = 0, py = 0;

                    if (relative) {
                        px = prevX;
                        py = prevY;
                    }
                    var c2 = {
                        x: px + segment.args[0],
                        y: py + segment.args[1]
                    };

                    if (relative) {
                        prevX += segment.args[2];
                        prevY += segment.args[3];
                    }
                    else {
                        prevX = segment.args[2];
                        prevY = segment.args[3];
                    }

                    var p2 = {
                        x: prevX,
                        y: prevY
                    };

                    cubic2Points([[p1, c1, c2, p2]], contour);
                    prevc1 = c2;
                }
                // 圆弧
                else if (cmd === 'A') {
                    throw 'not support arc';
                }
            }

            return contours;
        }



        return svg2contours;
    }
);
