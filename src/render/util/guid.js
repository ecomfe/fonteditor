/**
 * @file 产生唯一的guid
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
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
