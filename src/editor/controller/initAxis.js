/**
 * @file Editor 的坐标系初始化
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';
import GraduationMarker from '../widget/GraduationMarker';

/**
 * 设置坐标参数
 *
 * @param {Object} options 坐标选项
 * @see editor/options
 */
function setAxis(options) {

    let oldUnitsPerEm = this.options.unitsPerEm;
    this.options.unitsPerEm = options.unitsPerEm;

    lang.overwrite(this.options.axis, options);

    // 设置gap
    if (options.graduation && options.graduation.gap) {
        this.options.axis.graduation.gap = options.graduation.gap;
    }

    // 设置当前的axis
    let axisOpt = lang.clone(this.options.axis);
    let scale = this.render.camera.scale;
    let metrics = axisOpt.metrics;

    Object.keys(metrics).forEach(function (m) {
        axisOpt.metrics[m] = metrics[m] * scale;
    });

    axisOpt.unitsPerEm = axisOpt.unitsPerEm * scale;

    Object.assign(this.axis, axisOpt);

    // 缩放到合适位置
    let size = this.render.getSize();
    this.render.scale(oldUnitsPerEm / this.options.unitsPerEm, {
        x: size.width / 2,
        y: size.height / 2
    });

}

/**
 * 初始化坐标系
 */
export default function () {
    let width = this.render.painter.width;
    let height = this.render.painter.height;
    let options = this.options;

    // 坐标原点位置，基线原点
    let originX = (width - options.unitsPerEm) / 2;
    let origionY = (height + (options.unitsPerEm + options.axis.metrics.descent)) / 2;

    // 绘制轴线
    this.axis = this.axisLayer.addShape('axis', Object.assign(lang.clone(options.axis), {
        id: 'axis',
        x: originX,
        y: origionY,
        unitsPerEm: options.unitsPerEm,
        selectable: false
    }));

    // 右支撑
    this.rightSideBearing = this.referenceLineLayer.addShape('gridarrow', {
        id: 'rightSideBearing',
        p0: {
            x: options.unitsPerEm / 2
        },
        arrow: {
            y: 22
        },
        style: {
            fill: true,
            stroke: true,
            fillColor: 'blue',
            strokeColor: 'blue'
        }
    });

    // 刻度线
    this.graduation = this.graduationLayer.addShape('graduation', {
        config: this.axis
    });

    // 刻度线标记
    this.graduationMarker = new GraduationMarker(this.render.main, options.axis.graduation);

    // 设置吸附选项
    this.sorption.setGrid(this.axis);

    this.setAxis = setAxis;
}
