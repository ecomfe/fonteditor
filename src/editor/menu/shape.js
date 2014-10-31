/**
 * @file shape.js
 * @author mengke01
 * @date 
 * @description
 * 路径
 */


define(
    function(require) {
        return [
            {
                name: 'remove',
                title: '删除轮廓'
            },
            {
                name: 'reverse_point',
                title: '改变方向'
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
                name: 'order',
                title: '顺序',
                items: [
                    {
                        name: 'top',
                        title: '置前'
                    },
                    {
                        name: 'bottom',
                        title: '置后'
                    },
                    {
                        name: 'up',
                        title: '上移一层'
                    },
                    {
                        name: 'down',
                        title: '下移一层'
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
                name: 'add_referenceline',
                title: '添加边界参考线'
            }
        ];
    }
);
