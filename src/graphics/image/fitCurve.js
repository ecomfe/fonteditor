/**
 * @file 三次bezier曲线点拟合
 *
 * An Algorithm for Automatically Fitting Digitized Curves
 * by Philip J. Schneider
 * from "Graphics Gems", Academic Press, 1990
 *
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var MAX_ITERATIONS = 4; // 最大的迭代次数

        /**
         * 将点转换成余弦值
         *
         * @param  {Object} p 点
         * @return {Object} 余弦值
         */
        function normalize(p) {
            var factor = 1 / Math.sqrt(p.x * p.x + p.y * p.y);
            p.x = p.x * factor;
            p.y = p.y * factor;
            return p;
        }

        /**
         * 求两点距离
         *
         * @param  {Object} p0 p0
         * @param  {Object} p1 p1
         * @return {number} 距离值
         */
        function dist(p0, p1) {
            return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
        }

        /**
         * 计算左侧正切点
         *
         * @param  {Array} points 点集合
         * @param  {number} end    点索引
         * @return {Object} 点
         */
        function computeLeftTangent(points, end) {
            var x = points[end + 1].x - points[end].x;
            var y = points[end + 1].y - points[end].y;
            return normalize({
                x: x,
                y: y
            });
        }

        /**
         * 计算右侧正切点
         *
         * @param  {Array} points 点集合
         * @param  {number} end    点索引
         * @return {Object} 点
         */
        function computeRightTangent(points, end) {
            var x = points[end - 1].x - points[end].x;
            var y = points[end - 1].y - points[end].y;
            return normalize({
                x: x,
                y: y
            });
        }

        /**
         * 计算中间正切点
         *
         * @param  {Array} points 点集合
         * @param  {number} end    点索引
         * @return {Object} 点
         */
        function computeCenterTangent(points, center) {
            var x = (points[center - 1].x - points[center + 1].x) / 2;
            var y = (points[center - 1].y - points[center + 1].y) / 2;
            return normalize({
                x: x,
                y: y
            });
        }

        /**
         * 计算bezier曲线B0参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B0(u) {
            var tmp = 1.0 - u;
            return (tmp * tmp * tmp);
        }

        /**
         * 计算bezier曲线B1参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B1(u) {
            var tmp = 1.0 - u;
            return (3 * u * (tmp * tmp));
        }

        /**
         * 计算bezier曲线B2参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B2(u) {
            var tmp = 1.0 - u;
            return (3 * u * u * tmp);
        }

        /**
         * 计算bezier曲线B3参数
         *
         * @param {number} u t值
         * @return {number}
         */
        function B3(u) {
            return (u * u * u);
        }

        /**
         * 计算向量内积
         *
         * @param {Object} a a点
         * @param {Object} b b点
         */
        function v2Dot(a, b) {
            return (a.x * b.x) + (a.y * b.y);
        }

        /*
         *  ChordLengthParameterize :
         *  Assign parameter values to digitized points
         *  using relative distances between points.
         * 使用线段法计算各个点上的t值
         *
         * @param  {Array} points 点集合
         * @param  {number} first    点索引
         * @param  {number} last    点索引
         * @return {Array} t值集合
         */
        function chordLengthParameterize(points, first, last)
        {
            var i;
            var u = [0];
            for (i = first + 1; i <= last; i++) {
                u[i - first] = u[i - first - 1] + dist(points[i - 1], points[i]);
            }
            var length = u[last - first];
            for (i = first + 1; i <= last; i++) {
                u[i - first] = u[i - first] / length;
            }

            return u;
        }

        /*
         *  Bezier :
         *      Evaluate a Bezier curve at a particular parameter value
         *
         */
        /**
         * 计算bezier点在特定位置起始点位置，使用连接点法，参考bezier曲线定义
         *
         * @param {number} degree 深度
         * @param {Array} bezierPoints bezier点集合
         * @param {number} t t值
         */
        function bezierII(degree, bezierPoints, t) {
            var i;
            var j;
            var temp = []; // Local copy of control points

            for (i = 0; i <= degree; i++)
            {
                temp[i] = {
                    x: bezierPoints[i].x,
                    y: bezierPoints[i].y
                };
            }

            /* Triangle computation */
            for (i = 1; i <= degree; i++)
            {
                for (j = 0; j <= degree - i; j++)
                {
                    temp[j].x = (1.0 - t) * temp[j].x + t * temp[j + 1].x;
                    temp[j].y = (1.0 - t) * temp[j].y + t * temp[j + 1].y;
                }
            }

            return temp[0];
        }


        /**
         * 计算最大错误点的位置和错误值
         *
         * @param  {Array} points 点集合
         * @param  {number} first 起始点
         * @param  {number} last  结束点
         * @param  {Array} bezCurve bezier点参数
         * @param  {Array} u t参数集合
         *
         * @return {Object} 最大错误点的位置和错误值
         */
        function computeMaxError(points, first, last, bezCurve, u, splitPoint) {
            var maxDist = 0; // Maximum error

            var splitPoint = Math.floor((last - first + 1) / 2);
            for (var i = first + 1; i < last; i++) {
                var p = bezierII(3, bezCurve, u[i - first]);
                var x = p.x - points[i].x;
                var y = p.y - points[i].y;
                var dist = x * x + y * y;
                if (dist >= maxDist) {
                    maxDist = dist;
                    splitPoint = i;
                }
            }

            return {
                dist: maxDist,
                index: splitPoint
            };
        }

         /**
          * 牛顿迭代法求优化bezier优化点
          *
          * @param  {Array} Q bezier参数点
          * @param  {Object} P 当前点
          * @param  {number} u 当前点t值
          * @return {u} 优化后的t值
          */
        function newtonRaphsonRootFind(Q, P, u) {
            var numerator;
            var denominator;
            var Q1 = []; //  Q'
            var Q2 = [];  // Q''
            var Q_u; // u evaluated at Q, Q', & Q''
            var Q1_u;
            var Q2_u;
            var i;

            Q_u = bezierII(3, Q, u);

            /* Generate control vertices for Q' */
            for (i = 0; i <= 2; i++) {
                Q1[i] = {
                    x: (Q[i + 1].x - Q[i].x) * 3.0,
                    y: (Q[i + 1].y - Q[i].y) * 3.0
                };
            }

            /* Generate control vertices for Q'' */
            for (i = 0; i <= 1; i++) {
                Q2[i] = {
                    x: (Q[i + 1].x - Q[i].x) * 2.0,
                    y: (Q[i + 1].y - Q[i].y) * 2.0
                };
            }

            /* Compute Q'(u) and Q''(u) */
            Q1_u = bezierII(2, Q1, u);
            Q2_u = bezierII(1, Q2, u);

            /* Compute f(u)/f'(u) */
            numerator = (Q_u.x - P.x) * (Q1_u.x) + (Q_u.y - P.y) * (Q1_u.y);
            denominator = (Q1_u.x) * (Q1_u.x)
                + (Q1_u.y) * (Q1_u.y)
                + (Q_u.x - P.x) * (Q2_u.x)
                + (Q_u.y - P.y) * (Q2_u.y);

            if (denominator === 0) {
                return u;
            }

            /* u = u - f(u)/f'(u) */
            return u - (numerator / denominator);
        }

        /**
         * 对当前的bezier参数和t值集合进行优化获取新的t值集合
         *
         * @param  {Array} points 点集合
         * @param  {number} first 起始索引
         * @param  {number} last  结束索引
         * @param  {Array} u t值集合
         * @param  {Array} bezCurve bezier曲线点集
         * @return {Array} 优化后的t值集合
         */
        function reparameterize(points, first, last, u, bezCurve) {
            var uPrime = [];
            for (var i = first; i <= last; i++) {
                uPrime[i - first] = newtonRaphsonRootFind(bezCurve, points[i], u[i - first]);
            }
            return uPrime;
        }


        /**
         * 根据当前参数集合生成bezier曲线点
         *
         * @param  {Array} points 点集合
         * @param  {number} first  起始点
         * @param  {number} last   结束点
         * @param  {Array} uPrime t参数集合
         * @param  {Object} tHat1  左侧切线点
         * @param  {Object} tHat2  右侧切线点
         * @return {Array}        bezier曲线点
         */
        function generateBezier(points, first, last, uPrime, tHat1, tHat2) {

            var A = [];
            var C = [[0, 0], [0, 0]]; // Matrix C
            var X = [0, 0];  // Matrix X
            var tmp; // Utility variable
            var u;
            var nPts = last - first + 1; // number of pts in sub-curve

            /* Compute the A's  */
            for (i = 0; i < nPts; i++) {
                var v1 = {
                    x: tHat1.x,
                    y: tHat1.y
                };
                var v2 = {
                    x: tHat2.x,
                    y: tHat2.y
                };
                u = uPrime[i];
                v1.x *= B1(u);
                v1.y *= B1(u);
                v2.x *= B2(u);
                v2.y *= B2(u);
                A[i] = [v1, v2];
            }

            var firstPoint = points[first]; // 起始点
            var lastPoint = points[last]; // 结束点
            for (var i = 0; i < nPts; i++) {
                C[0][0] += v2Dot(A[i][0], A[i][0]);
                C[0][1] += v2Dot(A[i][0], A[i][1]);
                C[1][0] = C[0][1];
                C[1][1] += v2Dot(A[i][1], A[i][1]);

                var pi = points[first + i]; // 当前点
                u = uPrime[i];
                tmp = {
                    x: pi.x - (firstPoint.x * B0(u) + firstPoint.x * B1(u) + lastPoint.x * B2(u) + lastPoint.x * B3(u)),
                    y: pi.y - (firstPoint.y * B0(u) + firstPoint.y * B1(u) + lastPoint.y * B2(u) + lastPoint.y * B3(u))
                };

                X[0] += v2Dot(A[i][0], tmp);
                X[1] += v2Dot(A[i][1], tmp);
            }

            /* Compute the determinants of C and X  */
            var det_C0_C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1];
            var det_C0_X = C[0][0] * X[1] - C[1][0] * X[0];
            var det_X_C1 = X[0] * C[1][1] - X[1] * C[0][1];

            /* Finally, derive alpha values */
            var alpha_l = (det_C0_C1 == 0) ? 0.0 : det_X_C1 / det_C0_C1;
            var alpha_r = (det_C0_C1 == 0) ? 0.0 : det_C0_X / det_C0_C1;

            /* If alpha negative, use the Wu/Barsky heuristic (see text) */
            /* (if alpha is 0, you get coincident control points that lead to
             * divide by zero in any subsequent NewtonRaphsonRootFind() call. */
            var segLength = Math.sqrt(Math.pow(firstPoint.x - lastPoint.x, 2) + Math.pow(firstPoint.y - lastPoint.y, 2));
            var epsilon = 1.0e-6 * segLength;
            var bezCurve = [];
            bezCurve[0] = firstPoint;
            bezCurve[3] = lastPoint;

            if (alpha_l < epsilon || alpha_r < epsilon) {
                /* fall back on standard (probably inaccurate) formula, and subdivide further if needed. */
                var dist = segLength / 3.0;
                bezCurve[1] = {
                    x: tHat1.x * dist + firstPoint.x,
                    y: tHat1.y * dist + firstPoint.y
                };
                bezCurve[2] = {
                    x: tHat2.x * dist + lastPoint.x,
                    y: tHat2.y * dist + lastPoint.y
                };

                return bezCurve;
            }

            /*  First and last control points of the Bezier curve are */
            /*  positioned exactly at the first and last data points */
            /*  Control points 1 and 2 are positioned an alpha distance out */
            /*  on the tangent vectors, left and right, respectively */

            bezCurve[1] = {
                x: tHat1.x * alpha_l + firstPoint.x,
                y: tHat1.y * alpha_l + firstPoint.y
            };

            bezCurve[2] = {
                x: tHat2.x * alpha_r + lastPoint.x,
                y: tHat2.y * alpha_r + lastPoint.y
            };

            return bezCurve;
        }



        /**
         * 三次bezier曲线拟合
         *
         * @param  {Array} points 点集合
         * @param  {number} first 起始点
         * @param  {number} last 结束点
         * @param  {Object} tHat1 起始切线点点
         * @param  {Object} tHat2 右侧切线点
         * @param  {number} error 最大错误
         * @param  {Array} result 结果点集合
         */
        function fitCubic(points, first, last, tHat1, tHat2, error, result) {
            var bezCurve = []; // Control points of fitted Bezier curve
            var nPts; // Number of points in subset
            var i;

            nPts = last - first + 1;

            var firstPoint = points[first]; // 起始点
            var lastPoint = points[last]; // 结束点
            var segLength = Math.sqrt(Math.pow(firstPoint.x - lastPoint.x, 2) + Math.pow(firstPoint.y - lastPoint.y, 2));

            //  Use heuristic if region only has two points in it
            if (nPts == 2) {
                var dist = segLength / 3.0;

                bezCurve[0] = firstPoint;
                bezCurve[3] = lastPoint;
                bezCurve[1] = {
                    x: tHat1.x * dist + firstPoint.x,
                    y: tHat1.y * dist + firstPoint.y
                };
                bezCurve[2] = {
                    x: tHat2.x * dist + lastPoint.x,
                    y: tHat2.y * dist + lastPoint.y
                };

                result.push(bezCurve[1]);
                result.push(bezCurve[2]);
                result.push(bezCurve[3]);
                return;
            }

            /*  Parameterize points, and attempt to fit curve */
            var uPrime; // Improved parameter values
            var maxError; // Maximum fitting error
            var iterationError = error * error; // Error below which you try iterating
            var u = chordLengthParameterize(points, first, last); // Parameter values for point

            bezCurve = generateBezier(points, first, last, u, tHat1, tHat2);
            /*  Find max deviation of points to fitted curve */
            var maxError = computeMaxError(points, first, last, bezCurve, u);

            if (maxError.dist < error) {
                result.push(bezCurve[1]);
                result.push(bezCurve[2]);
                result.push(bezCurve[3]);
                return;
            }


            /*  If error not too large, try some reparameterization  */
            /*  and iteration */
            if (maxError.dist < iterationError) {
                for (i = 0; i < MAX_ITERATIONS; i++) {
                    uPrime = reparameterize(points, first, last, u, bezCurve);
                    bezCurve = generateBezier(points, first, last, uPrime, tHat1, tHat2);
                    maxError = computeMaxError(points, first, last, bezCurve, uPrime);

                    if (maxError.dist < error) {
                        result.push(bezCurve[1]);
                        result.push(bezCurve[2]);
                        result.push(bezCurve[3]);
                        return;
                    }

                    u = uPrime;
                }
            }

            /* Fitting failed -- split at max error point and fit recursively */
            var splitPoint = maxError.index;
            var tHatCenter = computeCenterTangent(points, splitPoint); // Unit tangent vector at splitPoint
            fitCubic(points, first, splitPoint, tHat1, tHatCenter, error, result);
            tHatCenter.x = -tHatCenter.x;
            tHatCenter.y = -tHatCenter.y;
            fitCubic(points, splitPoint, last, tHatCenter, tHat2, error, result);
        }



        /**
         * 三次bezier曲线点拟合点集，返回的结果不包含起始点和结束点
         *
         * @param  {Array} points 点集合
         * @param  {number} error  最大错误距离
         *
         * @return {Array}  结果点集
         */
        function fitCurve(points, error, tHat1, tHat2) {
            var last = points.length - 1;
            if (!tHat1) {
                var tHat1 = computeLeftTangent(points, 0);
            }
            if (!tHat2) {
                var tHat2 = computeRightTangent(points, last);
            }
            var result = [];
            fitCubic(points, 0, last, tHat1, tHat2, error, result);
            return result;
        }

        fitCurve.normalize = normalize;

        return fitCurve;
    }
);
