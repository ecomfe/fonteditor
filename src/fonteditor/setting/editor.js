/**
 * @file 默认的FontEditor设置
 * @author mengke01(kekee000@gmail.com)
 */

import editorOptions from 'editor/options';
const editorDefault = editorOptions.editor;

export default{

    saveSetting: true, // 是否保存setting

    // 查看器选项
    viewer: {
        color: '', // 查看器颜色
        shapeSize: 'normal', // 字形大小
        pageSize: 100 // 翻页大小
    },

    // 编辑器选项
    // see : editor/options.editor
    editor: {
        sorption: {
            enableGrid: false,
            enableShape: true
        },
        fontLayer: {
            strokeColor: editorDefault.fontLayer.strokeColor,
            fill: true,
            fillColor: editorDefault.fontLayer.fillColor
        },
        referenceline: {
            style: {
                strokeColor: editorDefault.referenceline.style.strokeColor
            }
        },
        axis: {
            showGrid: true,
            gapColor: editorDefault.axis.gapColor,
            metricsColor: editorDefault.axis.metricsColor,
            graduation: {
                gap: editorDefault.axis.graduation.gap
            }
        }
    }
};
