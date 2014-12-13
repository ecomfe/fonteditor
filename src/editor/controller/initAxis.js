/**
 * @file initAxis.js
 * @author mengke01
 * @date 
 * @description
 * Editor 的坐标系初始化
 */


define(
    function(require) {
        
        var lang = require('common/lang');
        var GraduationMarker = require('../widget/GraduationMarker');

        /**
         * 初始化坐标系
         * 
         * @param {Object} origin 字体原点
         */
        function initAxis() {
            var width = this.render.painter.width;
            var height = this.render.painter.height;
            var options = this.options;

            // 坐标原点位置，基线原点
            var originX = (width - options.unitsPerEm) / 2;
            var origionY = (height + (options.unitsPerEm + options.axis.metrics.descent)) / 2;

            // 绘制轴线
            this.axis = this.axisLayer.addShape('axis', lang.extend(lang.clone(options.axis), {
                id: 'axis',
                x: originX,
                y: origionY,
                unitsPerEm: options.unitsPerEm,
                selectable: false
            }));

            // 右支撑
            this.rightSideBearing = this.referenceLineLayer.addShape('line', {
                id: 'rightSideBearing',
                p0: {
                    x: options.unitsPerEm / 2
                },
                style: {
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
        }


        /**
         * 设置坐标信息
         * 
         * @param {Object} options 坐标选项
         * @return {this} 
         */
        function setAxis(options) {

            var oldUnitsPerEm = this.options.unitsPerEm;
            this.options.unitsPerEm = options.unitsPerEm;

            lang.overwrite(this.options.axis, options);

            // 设置gap
            this.options.axis.graduation.gap = options.graduation && options.graduation.gap 
                ? options.graduation.gap : this.options.unitsPerEm / 512 * 100;

            // 设置当前的axis
            var axisOpt = lang.clone(this.options.axis);
            var scale = this.render.camera.scale;
            var metrics = axisOpt.metrics;
            Object.keys(metrics).forEach(function(m) {
                axisOpt.metrics[m] = metrics[m] * scale;
            });

            axisOpt.unitsPerEm = axisOpt.unitsPerEm * scale;

            lang.extend(this.axis, axisOpt);

            // 缩放到合适位置
            var size = this.render.getSize();
            this.render.scale(oldUnitsPerEm / this.options.unitsPerEm, {
                x: size.width / 2, 
                y: size.height / 2
            });

        }

        return function() {
            initAxis.call(this);
            this.setAxis = setAxis;
        };;
    }
);
