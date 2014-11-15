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
            point: require('./Point'),
            rect: require('./Rect'),
            polygon: require('./Polygon'),
            font: require('./Font'),
            glyf: require('./Glyf'),
            path: require('./Path'),
            axis: require('./Axis'),
            graduation: require('./Graduation'),
            line: require('./Line')
        };
        return support;
    }
);
