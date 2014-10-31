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
            },
            {
                name: 'add_referenceline',
                title: '添加边界参考线'
            }
        ];
    }
);
