/**
 * @file initBinder.js
 * @author mengke01
 * @date
 * @description
 * 初始化绑定器
 */


define(
    function (require) {

        var commandSupport = require('../command/commandSupport');

        /**
         * 初始化绑定器
         */
        function initBinder () {
            var me = this;

            // 保存历史记录
            me.on('change', function () {
                me.history.add(me.getShapes());
            });


            me.on('command', function (e) {
                if (false !== e.result && commandSupport.history[e.command]) {
                    me.fire('change');
                }
            });
        }

        return initBinder;
    }
);
