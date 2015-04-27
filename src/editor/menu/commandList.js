/**
 * @file 命令集合
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        return {
            point: require('./point'),
            shape: require('./shape'),
            shapes: require('./shapes'),
            editor: require('./editor')
        };
    }
);
