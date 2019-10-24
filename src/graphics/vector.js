/**
 * @file 向量相关操作
 * @author mengke01(kekee000@gmail.com)
 */


/**
 * 求点到向量的距离平方
 *
 * @param  {Object} p0 p0
 * @param  {Object} p1 p1
 * @param  {Object} p  p
 * @return {number} 距离
 */
function getDistPow(p0, p1, p) {

    let A = p1.y - p0.y;
    let B = p0.x - p1.x;

    if (A === 0 && B === 0) {
        return Math.pow(p.x - p0.x, 2) + Math.pow(p.y - p0.y, 2);
    }

    if (A === 0) {
        return Math.pow(p.y - p0.y, 2);
    }

    if (B === 0) {
        return Math.pow(p.x - p0.x, 2);
    }

    let C = p1.x * p0.y - p0.x * p1.y;

    return Math.pow(A * p.x + B * p.y + C, 2) / (A * A + B * B);
}

export default {

    /**
     * 获取向量夹角余弦，传入3个点或者向量的x1, y1, x2, y2
     *
     * @param  {Object} p0 p0
     * @param  {Object} p1 p1
     * @param  {Object} p2 p2
     * @param  {?Object} p3 p3
     * @return {number}    夹角余弦
     */
    getCos(p0, p1, p2, p3) {
        let x1;
        let y1;
        let x2;
        let y2;
        if (typeof p0 === 'number') {
            x1 = p0;
            y1 = p1;
            x2 = p2;
            y2 = p3;
        }
        else {
            x1 = p1.x - p0.x;
            y1 = p1.y - p0.y;
            x2 = p2.x - p1.x;
            y2 = p2.y - p1.y;
        }

        return (x1 * x2 + y1 * y2) / Math.sqrt(x1 * x1 + y1 * y1) / Math.sqrt(x2 * x2 + y2 * y2);
    },

    /**
     * 求点到向量的距离
     *
     * @param  {Object} p0 p0
     * @param  {Object} p1 p1
     * @param  {Object} p  p
     * @return {number} 距离
     */
    getDist(p0, p1, p) {
        return Math.sqrt(getDistPow(p0, p1, p));
    },

    /**
     * 求两点距离
     *
     * @param  {Object} p0 p0
     * @param  {Object} p1 p1
     * @return {number} 距离
     */
    dist(p0, p1) {
        return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
    },

    /**
     * 将点转换成余弦值
     *
     * @param  {Object} p 点
     * @return {Object} 余弦值
     */
    normalize(p) {
        let factor = 1 / Math.sqrt(p.x * p.x + p.y * p.y);
        p.x = p.x * factor;
        p.y = p.y * factor;
        return p;
    }

};
