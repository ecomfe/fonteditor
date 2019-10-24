/**
 * @file render.js
 * @author mengke01
 * @date
 * @description
 * editor 组件测试
 */

import editor from 'editor/main';
const shape_baidu = require('../data/contours-1');

let currentEditor;
const entry = {

    /**
     * 初始化
     */
    init() {
        currentEditor = editor.create($('#render-view').get(0));
        window.editor = currentEditor.setFont(shape_baidu);
        //currentEditor.blur();

    }
};

entry.init();