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

        /**
         * 初始化坐标系
         * 
         * @param {Object} origin 字体原点
         */
        function initAxis(origin) {

            // 绘制轴线
            this.axis = this.axisLayer.addShape('axis', lang.extend(this.options.axis, {
                id: 'axis',
                x: origin.x,
                y: origin.y,
                unitsPerEm: this.options.unitsPerEm,
                metrics: this.options.metrics,
                selectable: false
            }));

            this.rightSideBearing = this.axisLayer.addShape('line', {
                id: 'rightSideBearing',
                p0: {
                    x: origin.rightSideBearing
                },
                style: {
                    strokeColor: 'blue'
                }
            });

            this.render.getLayer('graduation').addShape('graduation', {
                config: this.axis
            });
        }

        return initAxis;
    }
);
