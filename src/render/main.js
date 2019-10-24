/**
 * @file 创建图形渲染组件
 * @author mengke01(kekee000@gmail.com)
 */

import Render from './Render';
import Controller from './Controller';

export default {

    /**
     * 创建一个render
     *
     * @param {HTMLElement} main 主控区域
     * @param {Object} options 创建参数
     * @param {Controller} options.controller 控制器
     * @return {Render} render对象
     */
    create(main, options = {}) {
        let render = new Render(main, options);
        let controller = options.controller;
        delete options.controller;

        // 设置render的默认控制器
        if (!controller) {
            controller = new Controller();
        }

        controller.setRender(render);
        return render;
    }
};
