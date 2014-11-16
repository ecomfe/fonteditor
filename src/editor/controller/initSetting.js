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

        /**
         * 初始化设置选项
         */
        function initSetting() {
            menuUtil.setSelected(
                commandList.editor, 'setting.gridsorption',
                !!this.options.sorption.enableGrid
            );
            menuUtil.setSelected(
                commandList.editor, 'setting.shapesorption',
                !!this.options.sorption.enableShape
            );
            menuUtil.setSelected(
                commandList.editor, 'setting.showgrid',
                !!this.options.axis.showGrid
            );
        }


        return initSetting;
    }
);
