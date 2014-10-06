/**
 * @file program.js
 * @author mengke01
 * @date 
 * @description
 * 程序运行时组件
 */


define(
    function(require) {

        var program = {

            /**
             * 暂存对象
             * 
             * @type {Object}
             */
            data: {},

            loading: require('./widget/loading')
        };

        return program;
    }
);
