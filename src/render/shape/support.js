/**
 * @file support.js
 * @author mengke01
 * @date 
 * @description
 * 支持的shape集合
 */

define(
    function(require) {

        var support = {
            circle: require('./Circle'),
            rect: require('./Rect'),
            font: require('./Font')
        };
        return support;
    }
);
