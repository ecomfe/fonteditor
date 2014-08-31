/**
 * @file guid.js
 * @author mengke01
 * @date 
 * @description
 * 产生唯一的guid
 */


define(
    function(require) {
        var counter = 0;

        /**
         * 生成guid
         * 
         * @param {string} prefix 前缀
         * @return {string} guid字符串
         */
        function guid(prefix) {
            return (prefix || 'render') + '-' + (counter++);
        }

        return guid;
    }
);
