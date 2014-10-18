/**
 * @file initLayer.js
 * @author mengke01
 * @date 
 * @description
 * Editor的layer初始化
 */


define(
    function(require) {
        var lang = require('common/lang');

        /**
         * 初始化层
         */
        function initLayer() {

            this.coverLayer = this.render.addLayer('cover', lang.extend(this.options.coverLayer, {
                level: 30,
                fill: false,
                strokeColor: 'green',
                fillColor: 'white'
            }));

            this.fontLayer = this.render.addLayer('font', lang.extend(this.options.fontLayer, {
                level: 20,
                lineWidth: 1,
                strokeColor: '#999',
                fillColor: '#555',
                strokeSeparate: false
            }));

            this.axisLayer = this.render.addLayer('axis', {
                level: 10,
                fill: false
            });

            this.graduationLayer = this.render.addLayer('graduation', {
                level: 40,
                fill: false,
                disabled: true
            });
        }

        return initLayer;
    }
);
