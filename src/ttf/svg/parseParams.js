/**
 * @file 解析参数数组
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    var SEGMENT_REGEX = /\-?\d+(?:\.\d+)?\b/g;

    /**
     * 获取参数值
     *
     * @param  {string} d 参数
     * @return {number}   参数值
     */
    function getSegment(d) {
        return +d.trim();
    }

    /**
     * 解析参数数组
     *
     * @param  {string} str 参数字符串
     * @return {Array}   参数数组
     */
    return function (str) {
        if (!str) {
            return [];
        }
        var matchs = str.match(SEGMENT_REGEX);
        return matchs ? matchs.map(getSegment) : [];
    };
});
