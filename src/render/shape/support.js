/**
 * @file 支持的shape集合
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var support = {
            circle: require('./Circle'),
            cpoint: require('./CirclePoint'),
            point: require('./Point'),
            rect: require('./Rect'),
            polygon: require('./Polygon'),
            font: require('./Font'),
            path: require('./Path'),
            axis: require('./Axis'),
            graduation: require('./Graduation'),
            line: require('./Line'),
            beziercurve: require('./BezierCurve')
        };

        return support;
    }
);
