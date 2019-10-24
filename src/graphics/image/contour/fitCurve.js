/**
 * @file 三次bezier曲线点拟合
 *
 * An Algorithm for Automatically Fitting Digitized Curves
 * by Philip J. Schneider
 * from "Graphics Gems", Academic Press, 1990
 *
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable fecs-camel-case JS628 */
const MAX_ITERATIONS = 4; // 最大的迭代次数

/* eslint-disable new-cap */

/**
 * 将点转换成余弦值
 *
 * @param  {Object} p 点
 * @return {Object} 余弦值
 */
function normalize(p) {
    let factor = 1 / Math.sqrt(p.x * p.x + p.y * p.y);
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
    let x = points[end + 1].x - points[end].x;
    let y = points[end + 1].y - points[end].y;
    return normalize({x, y});
}

/**
 * 计算右侧正切点
 *
 * @param  {Array} points 点集合
 * @param  {number} end    点索引
 * @return {Object} 点
 */
function computeRightTangent(points, end) {
    let x = points[end - 1].x - points[end].x;
    let y = points[end - 1].y - points[end].y;
    return normalize({x, y});
}

/**
 * 计算中间正切点
 *
 * @param  {Array} points 点集合
 * @param  {number} center    中间点索引
 * @return {Object} 点
 */
function computeCenterTangent(points, center) {
    let x = (points[center - 1].x - points[center + 1].x) / 2;
    let y = (points[center - 1].y - points[center + 1].y) / 2;
    return normalize({x, y});
}

/**
 * 计算bezier曲线B0参数
 *
 * @param {number} u t值
 * @return {number}
 */
function B0(u) {
    let tmp = 1.0 - u;
    return (tmp * tmp * tmp);
}

/**
 * 计算bezier曲线B1参数
 *
 * @param {number} u t值
 * @return {number}
 */
function B1(u) {
    let tmp = 1.0 - u;
    return (3 * u * (tmp * tmp));
}

/**
 * 计算bezier曲线B2参数
 *
 * @param {number} u t值
 * @return {number}
 */
function B2(u) {
    let tmp = 1.0 - u;
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
 * @return {number}
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
function chordLengthParameterize(points, first, last) {
    let i;
    let u = [0];
    for (i = first + 1; i <= last; i++) {
        u[i - first] = u[i - first - 1] + dist(points[i - 1], points[i]);
    }
    let length = u[last - first];
    for (i = first + 1; i <= last; i++) {
        u[i - first] = u[i - first] / length;
    }

    return u;
}


/**
 * 计算bezier点在特定t的坐标，参考bezier曲线定义
 *
 * @param {number} degree 深度
 * @param {Array} bezierPoints bezier点集合
 * @param {number} t t值
 * @return {Object} 点
 */
function bezierII(degree, bezierPoints, t) {
    let i;
    let j;
    let temp = [];

    for (i = 0; i <= degree; i++) {
        temp[i] = {
            x: bezierPoints[i].x,
            y: bezierPoints[i].y
        };
    }

    /* Triangle computation */
    for (i = 1; i <= degree; i++) {
        for (j = 0; j <= degree - i; j++) {
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
function computeMaxError(points, first, last, bezCurve, u) {
    let maxDist = 0; // Maximum error
    let splitPoint = Math.floor((last - first + 1) / 2);

    for (let i = first + 1; i < last; i++) {
        let p = bezierII(3, bezCurve, u[i - first]);
        let x = p.x - points[i].x;
        let y = p.y - points[i].y;
        let dist = x * x + y * y;
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
    let numerator;
    let denominator;
    let Q1 = []; //  Q'
    let Q2 = [];  // Q''
    let Qu; // u evaluated at Q, Q', & Q''
    let Q1u;
    let Q2u;
    let i;

    Qu = bezierII(3, Q, u);

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
            x: (Q[i + 1].x - Q[i].x) * 6.0,
            y: (Q[i + 1].y - Q[i].y) * 6.0
        };
    }

    /* Compute Q'(u) and Q''(u) */
    Q1u = bezierII(2, Q1, u);
    Q2u = bezierII(1, Q2, u);

    /* Compute f(u)/f'(u) */
    numerator = (Qu.x - P.x) * (Q1u.x) + (Qu.y - P.y) * (Q1u.y);
    denominator = (Q1u.x) * (Q1u.x)
        + (Q1u.y) * (Q1u.y)
        + (Qu.x - P.x) * (Q2u.x)
        + (Qu.y - P.y) * (Q2u.y);

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
    let uPrime = [];
    for (let i = first; i <= last; i++) {
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

    let A = [];
    let C = [[0, 0], [0, 0]]; // Matrix C
    let X = [0, 0];  // Matrix X
    let tmp; // Utility variable
    let u;
    let nPts = last - first + 1; // number of pts in sub-curve
    let i;

    /* Compute the A's  */
    for (i = 0; i < nPts; i++) {
        let v1 = {
            x: tHat1.x,
            y: tHat1.y
        };
        let v2 = {
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

    let firstPoint = points[first]; // 起始点
    let lastPoint = points[last]; // 结束点
    for (i = 0; i < nPts; i++) {
        C[0][0] += v2Dot(A[i][0], A[i][0]);
        C[0][1] += v2Dot(A[i][0], A[i][1]);
        C[1][0] = C[0][1];
        C[1][1] += v2Dot(A[i][1], A[i][1]);

        let pi = points[first + i]; // 当前点
        u = uPrime[i];
        tmp = {
            x: pi.x - (firstPoint.x * B0(u) + firstPoint.x * B1(u) + lastPoint.x * B2(u) + lastPoint.x * B3(u)),
            y: pi.y - (firstPoint.y * B0(u) + firstPoint.y * B1(u) + lastPoint.y * B2(u) + lastPoint.y * B3(u))
        };

        X[0] += v2Dot(A[i][0], tmp);
        X[1] += v2Dot(A[i][1], tmp);
    }

    /* Compute the determinants of C and X  */
    let detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1];
    let detC0X = C[0][0] * X[1] - C[1][0] * X[0];
    let detXC1 = X[0] * C[1][1] - X[1] * C[0][1];

    /* Finally, derive alpha values */
    let alphaL = (detC0C1 === 0) ? 0.0 : detXC1 / detC0C1;
    let alphaR = (detC0C1 === 0) ? 0.0 : detC0X / detC0C1;

    /* If alpha negative, use the Wu/Barsky heuristic (see text) */
    /* (if alpha is 0, you get coincident control points that lead to
        * divide by zero in any subsequent NewtonRaphsonRootFind() call. */
    let segLength = Math.sqrt(
        Math.pow(firstPoint.x - lastPoint.x, 2) + Math.pow(firstPoint.y - lastPoint.y, 2)
    );
    let epsilon = 1.0e-6 * segLength;
    let bezCurve = [];
    bezCurve[0] = firstPoint;
    bezCurve[3] = lastPoint;

    if (alphaL < epsilon || alphaR < epsilon) {
        /* fall back on standard (probably inaccurate) formula, and subdivide further if needed. */
        let dist = segLength / 3.0;
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
        x: tHat1.x * alphaL + firstPoint.x,
        y: tHat1.y * alphaL + firstPoint.y
    };

    bezCurve[2] = {
        x: tHat2.x * alphaR + lastPoint.x,
        y: tHat2.y * alphaR + lastPoint.y
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
    let bezCurve = []; // Control points of fitted Bezier curve
    let nPts; // Number of points in subset
    let i;

    nPts = last - first + 1;

    //  Use heuristic if region only has two points in it
    if (nPts === 2) {
        let firstPoint = points[first]; // 起始点
        let lastPoint = points[last]; // 结束点
        let dist = Math.sqrt(
            Math.pow(firstPoint.x - lastPoint.x, 2) + Math.pow(firstPoint.y - lastPoint.y, 2)
        ) / 3;

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
    let uPrime; // Improved parameter values
    let u = chordLengthParameterize(points, first, last); // Parameter values for point

    bezCurve = generateBezier(points, first, last, u, tHat1, tHat2);

    /*  Find max deviation of points to fitted curve */
    let maxError = computeMaxError(points, first, last, bezCurve, u);

    if (maxError.dist < error) {
        result.push(bezCurve[1]);
        result.push(bezCurve[2]);
        result.push(bezCurve[3]);
        return;
    }


    /*  If error not too large, try some reparameterization  */
    /*  and iteration */
    if (maxError.dist < error * error) {
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
    let splitPoint = maxError.index;
    let tHatCenter = computeCenterTangent(points, splitPoint); // Unit tangent vector at splitPoint
    fitCubic(points, first, splitPoint, tHat1, tHatCenter, error, result);
    tHatCenter.x = -tHatCenter.x;
    tHatCenter.y = -tHatCenter.y;
    fitCubic(points, splitPoint, last, tHatCenter, tHat2, error, result);
}


/**
 * 三次bezier曲线点拟合点集，返回的结果不包含起始点
 *
 * @param  {Array} points 点集合
 * @param  {number} error  最大错误距离
 * @param  {?Object} tHat1  起始点向量
 * @param  {?Object} tHat2  结束点向量
 * @return {Array}  拟合后的点
 */
export default function fitCurve(points, error, tHat1, tHat2) {
    let last = points.length - 1;
    if (!tHat1) {
        tHat1 = computeLeftTangent(points, 0);
    }
    if (!tHat2) {
        tHat2 = computeRightTangent(points, last);
    }
    let result = [];
    fitCubic(points, 0, last, tHat1, tHat2, error, result);
    return result;
}

fitCurve.normalize = normalize;
