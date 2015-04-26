/**
 * @file base64字符串转数组
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * base64字符串转数组
         * @param  {string} base64 base64字符串
         * @return {Array}  数组
         */
        function base642bytes(base64) {
            var str = atob(base64);
            var result = [];
            for (var i = 0, l = str.length; i < l; i++) {
                result.push(str[i].charCodeAt(0));
            }
            return result;
        }

        return base642bytes;
    }
);
