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

            viewer: null, // glyf查看器

            project: null, // 项目管理器

            projectViewer: null, // 项目查看器

            ttfManager: null, // ttf管理器

            loading: require('./loading')
        };

        return program;
    }
);
