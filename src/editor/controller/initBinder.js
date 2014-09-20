/**
 * @file initBinder.js
 * @author mengke01
 * @date 
 * @description
 * 初始化绑定器
 */


define(
    function(require) {
        
        /**
         * 初始化绑定器
         */
        function initBinder() {
            var me = this;
            // 保存历史记录
            this.on('change', function(e) {
                me.history.add(me.getShapes());
            });
        }

        return initBinder;
    }
);
