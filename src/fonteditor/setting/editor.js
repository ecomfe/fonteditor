/**
 * @file editor.js
 * @author mengke01
 * @date 
 * @description
 * 默认的编辑器设置
 */

define(
    function(require) {

        var setting = {

            saveSetting: true, // 是否保存setting

            // 查看器选项
            viewer: {
                color: "", // 查看器颜色
                shapeSize: "normal", // 字形大小
                pageSize: 100, // 翻页大小
            },

            // 编辑器选项
            // see : editor/options.editor
            editor: {
                sorption: {
                    enableGrid: false,
                    enableShape: true
                },
                fontLayer: {
                    strokeColor: '#999',
                    fill: true,
                    fillColor: '#555'
                },
                referenceline: {
                    style: {
                        strokeColor: '#0FF'
                    }
                },
                axis: {
                    showGrid: true,
                    gapColor: '#A6A6FF',
                    metricsColor: 'red',
                    graduation: {
                        gap: 100
                    }
                }
            }
        };

        return setting;
    }
);
