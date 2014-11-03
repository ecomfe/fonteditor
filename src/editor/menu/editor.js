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
            // {
            //     name: 'intelligentadsorb',
            //     title: '智能吸附'
            // },
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
                name: 'font',
                title: '字形信息'
            }
        ];
    }
);
