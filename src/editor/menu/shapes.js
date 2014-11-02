/**
 * @file shapes.js
 * @author mengke01
 * @date 
 * @description
 * 路径组
 */


define(
    function(require) {
        return [
            {
                name: 'reverse_point',
                title: '改变方向'
            },
            {
                name: 'remove',
                title: '删除轮廓'
            },
            {
                name: 'cut',
                title: '剪切'
            },
            {
                name: 'copy',
                title: '复制'
            },
            {
                name: 'join',
                title: '连接轮廓',
                items: [
                    {
                        name: 'join_shapes',
                        title: '结合'
                    },
                    {
                        name: 'intersect_shapes',
                        title: '相交'
                    },
                    {
                        name: 'tangency_shapes',
                        title: '相切'
                    }
                ]
            },
            {
                name: 'transform',
                title: '变换',
                items: [
                    {
                        name: 'rotate_left',
                        title: '向左旋转'
                    },
                    {
                        name: 'rotate_right',
                        title: '向右旋转'
                    },
                    {
                        name: 'reverse_shapes',
                        title: '翻转'
                    },
                    {
                        name: 'mirror_shapes',
                        title: '镜像'
                    }
                ]
            },

            {
                name: 'shapes_align',
                title: '对齐形状',
                items: [
                    {
                        name: 'shapes_align',
                        type: 'left',
                        title: '左对齐'
                    },
                    {
                        name: 'shapes_align',
                        type: 'center',
                        title: '居中对齐'
                    },
                    {
                        name: 'shapes_align',
                        type: 'right',
                        title: '右对齐'
                    },
                    {
                        name: 'shapes_align',
                        type: 'top',
                        title: '顶部对齐'
                    },
                    {
                        name: 'shapes_align',
                        type: 'middle',
                        title: '中间对齐'
                    },
                    {
                        name: 'shapes_align',
                        type: 'bottom',
                        title: '底部对齐'
                    }
                ]
            },
            {
                name: 'shapes_verticalalign',
                title: '垂直方向',
                items: [
                    {
                        name: 'shapes_verticalalign',
                        type: 'ascent',
                        title: '顶端对齐'
                    },
                    {
                        name: 'shapes_verticalalign',
                        type: 'middle',
                        title: '居中对齐'
                    },
                    {
                        name: 'shapes_verticalalign',
                        type: 'descent',
                        title: '底端对齐'
                    },
                    {
                        name: 'shapes_verticalalign',
                        type: 'baseline',
                        title: '基线对齐'
                    }
                ]
            },
            {
                name: 'add_referenceline',
                title: '添加边界参考线'
            }
        ];
    }
);
