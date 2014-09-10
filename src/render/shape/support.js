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
            cpoint: require('./CirclePoint'),
            rect: require('./Rect'),
            dashedrect: require('./DashedRect'),
            point: require('./Point'),
            font: require('./Font'),
            path: require('./Path'),
            axis: require('./Axis')
        };
        return support;
    }
);
