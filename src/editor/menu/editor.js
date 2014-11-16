/**
 * @file editor.js
 * @author mengke01
 * @date 
 * @description
 * 编辑器
 */


define(
    function(require) {
        return [
            {
                name: 'addpath',
                title: '添加路径'
            },
            {
                name:'add_shapes',
                title: '添加形状',
                items: [
                    {
                        name: 'add_supportshapes',
                        type: 'circle',
                        title: '添加圆'
                    },
                    {
                        name: 'add_supportshapes',
                        type: 'rect',
                        title: '添加矩形'
                    },
                    {
                        name: 'add_supportshapes',
                        type: 'roundrect',
                        title: '添加圆角矩形'
                    },
                    {
                        name: 'add_supportshapes',
                        type: 'star',
                        title: '添加五角星'
                    },
                    {
                        name: 'add_supportshapes',
                        type: 'arrow',
                        title: '添加箭头'
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
                name: 'add_referenceline',
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
                name: 'setfont',
                title: '字形信息'
            }
        ];
    }
);
