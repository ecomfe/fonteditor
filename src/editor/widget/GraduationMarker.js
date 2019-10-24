/**
 * @file 刻度指示
 * @author mengke01(kekee000@gmail.com)
 */

export default class GraduationMarker {

    /**
     * 刻度指示
     *
     * @constructor
     * @param {HTMLElement} main 主元素
     * @param {Object} options 选项参数
     */
    constructor(main, options) {
        options = options || {};
        let xAxis = document.createElement('div');
        xAxis.className = 'marker-x';
        let yAxis = document.createElement('div');
        yAxis.className = 'marker-y';

        if (options.thickness) {
            xAxis.style.width = options.thickness + 'px';
            yAxis.style.height = options.thickness + 'px';
        }

        main.appendChild(this.xAxis = xAxis);
        main.appendChild(this.yAxis = yAxis);
    }

    /**
     * 显示坐标
     *
     * @param {number} x x坐标
     * @param {number} y y坐标
     */
    moveTo(x, y) {
        this.xAxis.style.top = y + 'px';
        this.yAxis.style.left = x + 'px';
    }

    /**
     * 注销
     */
    dispose() {
        this.xAxis.parentNode.removeChild(this.xAxis);
        this.yAxis.parentNode.removeChild(this.yAxis);
        this.xAxis = this.yAxis = null;
    }
}
