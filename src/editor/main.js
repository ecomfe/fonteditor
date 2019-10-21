/**
 * @file 编辑器主函数
 * @author mengke01(kekee000@gmail.com)
 */

import render from 'render/main';
import Editor from './Editor';
import defaultOptions from './options';

export default {

    /**
     * 创建一个编辑器
     *
     * @param {HTMLElement} main 主控区域
     * @param {Object} options 创建参数
     * @param {Object} options.controller 控制器函数
     *
     * @return {Render} render对象
     */
    create(main, options) {

        if (!main) {
            throw 'need main element';
        }

        options = Object.assign({}, defaultOptions, options);

        let editor = new Editor(main, options.editor);
        let opt = options.render || {};

        opt.controller = editor;
        render.create(main, opt);
        return editor;
    }
};

