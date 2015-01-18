/**
 * @file editor.js
 * @author mengke01
 * @date
 * @description
 * 编辑器
 */


define(
    function (require) {
        return [
            {
                name: 'addpath',
                title: '添加路径'
            },
            {
                name: 'add_shapes',
                title: '添加形状',
                items: [
                    {
                        name: 'addsupportshapes',
                        type: 'circle',
                        title: '圆'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'rect',
                        title: '矩形'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'roundrect',
                        title: '圆角矩形'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'star',
                        title: '五角星'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'arrow',
                        title: '箭头'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'triangle',
                        title: '三角形'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'heart',
                        title: '心形'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'tel',
                        title: '电话'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'drop',
                        title: '水滴'
                    },
                    {
                        name: 'addsupportshapes',
                        type: 'du',
                        title: '度图标'
                    }
                ]
            },
            {
                name: 'undo',
                title: '撤销'
            },
            {
                name: 'redo',
                title: '恢复'
            },
            {
                name: 'paste',
                title: '粘贴'
            },
            {
                name: 'split',
                title: '切割轮廓'
            },
            {
                name: 'setting',
                title: '设置',
                items: [
                    {
                        name: 'gridsorption',
                        title: '吸附到网格线'
                    },
                    {
                        name: 'shapesorption',
                        title: '吸附到轮廓'
                    },
                    {
                        name: 'showgrid',
                        title: '显示网格'
                    },
                    {
                        name: 'moresetting',
                        title: '更多..'
                    }
                ]
            },
            {
                name: 'addreferenceline',
                title: '添加参考线'
            },
            {
                name: 'clearreferenceline',
                title: '清除参考线'
            },
            {
                name: 'rescale',
                title: '重置缩放'
            },
            {
                name: 'fontsetting',
                title: '字形信息'
            },
            {
                name: 'save',
                title: '保存'
            }
        ];
    }
);
