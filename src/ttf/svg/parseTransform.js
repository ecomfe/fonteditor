/**
 * @file 解析transform参数
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    var parseParams = require('./parseParams');
    var TRANSFORM_REGEX = /(\w+)\s*\(([\d-.,\s]*)\)/g;

    /**
     * 解析transform参数
     *
     * @param {string} str 参数字符串
     * @return {Array} transform数组, 格式如下：
     *     [
     *         {
     *             name: 'scale',
     *             params: []
     *         }
     *     ]
     */
    function parseTransform(str) {

        if (!str) {
            return false;
        }

        TRANSFORM_REGEX.lastIndex = 0;
        var transforms = [];
        var match;

        while (match = TRANSFORM_REGEX.exec(str)) {
            transforms.push({
                name: match[1],
                params: parseParams(match[2])
            });
        }

        return transforms;
    }

    return parseTransform;
});
