/**
 * @file commandList.js
 * @author mengke01
 * @date
 * @description
 * 右键命令集合
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
