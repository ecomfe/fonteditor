/**
 * @file main.js
 * @author mengke01
 * @date 
 * @description
 * 编辑器主函数
 */


define(
    function(require) {
        
        var render = require('render/main');
        var Editor = require('./Editor');
        var exports = {};

        /**
         * 创建一个编辑器
         * @param {HTMLElement} main 主控区域
         * @param {Object} options 创建参数
         * @param {Controller} controller 控制器函数
         * @return {Render} render对象
         */
        exports.create = function(main, options) {
            
            if(!main) {
                throw 'need main element';
            }

            options = options || {};
            var editor = new Editor(main, options);
            var opt = options.renderOptions || {};
            opt.controller = editor;
            render.create(main, opt);
            return editor;
        };

        return exports;
    }
);
