/**
 * @file 编辑器选项
 * @author mengke01(kekee000@gmail.com)
 */
define(
    function (require) {
        var options = {

            // 编辑器相关
            editor: {

                unitsPerEm: 512, // 框大小

                // 吸附选项
                sorption: {
                    enableGrid: false, // 吸附到网格
                    enableShape: true, // 吸附到对象
                    gridDelta: 5, // 网格delta
                    delta: 5, // 对象delta
                    sorptionColor: '#F0913A'
                },

                // 辅助线
                referenceline: {
                    style: {
                        strokeColor: '#746AFE'
                    }
                },

                // 覆盖层
                coverLayer: {
                    lineColor: '#4780FF',
                    outlineColor: '#3372FF',
                    strokeColor: '#4780FF',
                    fillColor: 'white'
                },

                // 字体层
                fontLayer: {
                    lineWidth: 1,
                    strokeColor: '#888',
                    fill: true,
                    fillColor: '#999'
                },

                // 轴线
                axis: {
                    showGrid: true, // 显示网格
                    gapColor: '#DEDCFE', // 网格线颜色
                    axisColor: 'red',
                    metricsColor: '#FF9592', // 测量辅助线颜色
                    emColor: 'red', // em框颜色

                    // 字体测量规格
                    metrics: {
                        ascent: 480, // 上升
                        descent: -33, // 下降
                        xHeight: 256, // x高度
                        capHeight: 358 // 大写字母高度
                    },

                    // 刻度
                    graduation: {
                        gap: 100,
                        thickness: 20, // 厚度
                        markHeight: 3, // 标记高度
                        markBackgroundColor: '#C3CBD2', // 背景色
                        markColor: '#65737E', // 前景色
                        color: '#65737E' // 文字颜色
                    }
                },
                // 命令栏
                contextMenu: {}
            },


            // 渲染器相关
            render: {
                defaultRatio: 1.2, // 默认的缩放比例
                minScale: 0.1, // 最小缩放
                maxScale: 200, // 最大缩放
                enableScale: true, // 是否允许缩放
                enableResize: true // 是否允许大小改变
            }
        };
        return options;
    }
);
