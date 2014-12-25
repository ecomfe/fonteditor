/**
 * @file main.js
 * @author mengke01
 * @date 
 * @description
 * 图形渲染组件
 */

define(
    function(require) {
        var Render = require('./Render');
        var Controller = require('./Controller');
        var exports = {};

        /**
         * 创建一个render
         * @param {HTMLElement} main 主控区域
         * @param {Object} options 创建参数
         * @param {Controller} options.controller 控制器
         * @return {Render} render对象
         */
        exports.create = function(main, options) {
            options = options || {};
            var render = new Render(main, options);
            var controller = options.controller;
            delete options.controller;
            
            // 设置render的默认控制器
            if (!controller) {
                controller = new Controller();
            }

            controller.setRender(render);
            
            return render;
        };

        return exports;
    }
);
