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
                name: 'reversepoints',
                title: '改变方向'
            },
            {
                name: 'removeshapes',
                title: '删除轮廓'
            },
            {
                name: 'cutshapes',
                title: '剪切'
            },
            {
                name: 'copyshapes',
                title: '复制'
            },
            {
                name: 'join',
                title: '连接轮廓',
                items: [
                    {
                        name: 'joinshapes',
                        title: '结合'
                    },
                    {
                        name: 'intersectshapes',
                        title: '相交'
                    },
                    {
                        name: 'tangencyshapes',
                        title: '相切'
                    }
                ]
            },
            {
                name: 'transform',
                title: '变换',
                items: [
                    {
                        name: 'rotateleft',
                        title: '向左旋转'
                    },
                    {
                        name: 'rotateright',
                        title: '向右旋转'
                    },
                    {
                        name: 'flipshapes',
                        title: '翻转'
                    },
                    {
                        name: 'mirrorshapes',
                        title: '镜像'
                    }
                ]
            },

            {
                name: 'alignshapes_',
                title: '对齐形状',
                items: [
                    {
                        name: 'alignshapes',
                        align: 'left',
                        title: '左对齐'
                    },
                    {
                        name: 'alignshapes',
                        align: 'center',
                        title: '居中对齐'
                    },
                    {
                        name: 'alignshapes',
                        align: 'right',
                        title: '右对齐'
                    },
                    {
                        name: 'alignshapes',
                        align: 'top',
                        title: '顶部对齐'
                    },
                    {
                        name: 'alignshapes',
                        align: 'middle',
                        title: '中间对齐'
                    },
                    {
                        name: 'alignshapes',
                        align: 'bottom',
                        title: '底部对齐'
                    }
                ]
            },
            {
                name: 'horizontalalignshapes_',
                title: '水平方向',
                items: [
                    {
                        name: 'horizontalalignshapes',
                        align: 'left',
                        title: '左对齐'
                    },
                    {
                        name: 'horizontalalignshapes',
                        align: 'center',
                        title: '居中对齐'
                    },
                    {
                        name: 'horizontalalignshapes',
                        align: 'right',
                        title: '右对齐'
                    }
                ]
            },
            {
                name: 'verticalalignshapes_',
                title: '垂直方向',
                items: [
                    {
                        name: 'verticalalignshapes',
                        align: 'ascent',
                        title: '顶端对齐'
                    },
                    {
                        name: 'verticalalignshapes',
                        align: 'middle',
                        title: '居中对齐'
                    },
                    {
                        name: 'verticalalignshapes',
                        align: 'descent',
                        title: '底端对齐'
                    },
                    {
                        name: 'verticalalignshapes',
                        align: 'baseline',
                        title: '基线对齐'
                    }
                ]
            },
            {
                name: 'addreferenceline',
                title: '添加边界参考线'
            }
        ];
    }
);
