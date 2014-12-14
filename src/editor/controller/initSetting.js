/**
 * @file initSetting.js
 * @author mengke01
 * @date 
 * @description
 * 初始化设置
 */


define(
    function(require) {

        var menuUtil = require('../menu/util');
        var commandList = require('../menu/commandList');
        var lang = require('common/lang');

        /**
         * 初始化设置选项
         */
        function initSetting(options) {
            menuUtil.setSelected(
                commandList.editor, 'setting.gridsorption',
                !!options.sorption.enableGrid
            );
            menuUtil.setSelected(
                commandList.editor, 'setting.shapesorption',
                !!options.sorption.enableShape
            );
            menuUtil.setSelected(
                commandList.editor, 'setting.showgrid',
                !!options.axis.showGrid
            );
        }

        /**
         * 设置选项
         * 
         * @param {Object} options 选项
         * @return {this}
         */
        function setOptions(options) {

            this.execCommand('gridsorption', options.sorption.enableGrid);
            this.execCommand('shapesorption', options.sorption.enableShape);
            this.execCommand('showgrid', options.axis.showGrid);

            this.fontLayer.options.fill = !!options.fontLayer.fill;
            this.fontLayer.options.fillColor = options.fontLayer.fillColor;
            this.fontLayer.options.strokeColor = options.fontLayer.strokeColor;
            this.fontLayer.refresh();

            this.axis.gapColor = options.axis.gapColor;
            this.axis.metricsColor = options.axis.metricsColor;
            this.axis.emColor = options.axis.emColor;
            this.axis.graduation.gap = options.axis.graduation.gap || 100;
            this.axisLayer.refresh();
            this.graduationLayer.refresh();

            lang.overwrite(this.options, options);
        }

        return function() {
            initSetting.call(this, this.options);
            this.setOptions = setOptions;
        };
    }
);
