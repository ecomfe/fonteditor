/**
 * @file Editor的layer初始化
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 初始化层
 */
export default function initLayer() {

    this.axisLayer = this.render.addLayer('axis', {
        level: 10,
        fill: false
    });

    this.fontLayer = this.render.addLayer('font', Object.assign({
        level: 20,
        lineWidth: 1,
        strokeColor: '#999',
        fillColor: '#555',
        strokeSeparate: false
    }, this.options.fontLayer));

    this.coverLayer = this.render.addLayer('cover', Object.assign({
        level: 30,
        fill: false,
        strokeColor: this.options.coverLayer.strokeColor,
        fillColor: this.options.coverLayer.fillColor
    }, this.options.coverLayer));

    this.referenceLineLayer = this.render.addLayer('referenceline', {
        level: 40,
        fill: false,
        strokeColor: this.options.referenceline.style.strokeColor
    });


    this.graduationLayer = this.render.addLayer('graduation', {
        level: 50,
        fill: false,
        disabled: true
    });
}
