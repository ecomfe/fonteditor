/**
 * @file contoursCombine.js
 * @author mengke01
 * @date
 * @description
 * 路径合并，求交
 */

import lang from 'common/lang';
import editor from 'editor/main';
import shape_baidu from 'demo/../data/contours-2';

let currentEditor;

const entry = {

    /**
     * 初始化
     */
    init() {
        let clonedShape = lang.clone(shape_baidu);

        window.editor = currentEditor = editor.create($('#render-view').get(0));
        currentEditor.setFont(clonedShape);
        let jointLayer = currentEditor.fontLayer;
        let paths = currentEditor.fontLayer.shapes.map(function (shape) {
            return shape.points;
        });
    }
};

entry.init();
