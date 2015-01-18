/**
 * @file support.js
 * @author mengke01
 * @date
 * @description
 * 支持的自选形状
 */
define(
    function (require) {
        return {
            circle: require('./circle'),
            rect: require('./rect'),
            roundrect: require('./roundrect'),
            arrow: require('./arrow'),
            star: require('./star'),
            triangle: require('./triangle'),
            heart: require('./heart'),
            tel: require('./tel'),
            du: require('./du'),
            drop: require('./drop')
        };
    }
);
