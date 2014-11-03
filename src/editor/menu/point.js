/**
 * @file point.js
 * @author mengke01
 * @date 
 * @description
 * 点command
 */


define(
    function(require) {
        return [
            {
                name: 'add',
                title: '添加点'
            },
            {
                name: 'remove',
                title: '删除点'
            },
            {
                name: 'onCurve',
                title: '在曲线上'
            },
            {
                name: 'offCurve',
                title: '远离曲线'
            },
            {
                name: 'asStart',
                title: '作为开始点'
            }
        ];
    }
);
