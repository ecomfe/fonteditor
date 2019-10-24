/**
 * @file 视角对象，用来控制平移和缩放
 * @author mengke01(kekee000@gmail.com)
 */

export default class Camera {

    /**
     * 视角对象
     *
     * @param {Object} center 中心点
     * @param {number} scale 缩放级别
     * @param {number} ratio 缩放比例
     * @constructor
     */
    constructor(center, scale, ratio) {
        this.reset(center, scale, ratio);
    }

    /**
     * 重置camera
     *
     * @param {Object} center 中心点
     * @param {number} scale 缩放级别
     * @param {number} ratio 缩放比例
     */
    reset(center, scale, ratio) {
        this.center = center || {
            x: 0,
            y: 0
        };
        this.scale = scale || 1;
        this.ratio = ratio || 1;
    }

    /**
     * 注销
     */
    dispose() {
        this.center = this.ratio = this.scale = null;
    }
}
