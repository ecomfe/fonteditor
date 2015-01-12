/**
 * @file parseParams.js
 * @author mengke01
 * @description
 * 解析参数集合
 */


define(
    function (require) {

        var SEGMENT_REGEX = /\-?\d+(?:\.\d+)?\b/g;

        function getSegment(d) {
            return +d.trim();
        }

        return function (str) {

            if (!str) {
                return [];
            }
            var matchs = str.match(SEGMENT_REGEX);
            return matchs ? matchs.map(getSegment) : [];
        };
    }
);
