/**
 * @file viewer.js
 * @author mengke01
 * @date
 * @description
 * glyf编辑器相关命令
 */


define(
    function (require) {
        return [
            {
                name: 'copyshapes',
                title: '复制',
                quickKey: 'C',
                disabled: true
            },
            {
                name: 'pasteshapes',
                title: '粘贴',
                quickKey: 'V'
            },
            {
                name: 'removeshapes',
                title: '删除',
                quickKey: 'D',
                disabled: true
            },
            {
                name: 'save',
                title: '保存',
                quickKey: 'S'
            },
            {
                type: 'split'
            },
            {
                name: 'rangemode',
                title: '轮廓模式',
                ico: 'rangemode'
            },
            {
                name: 'pointmode',
                title: '点模式',
                ico: 'pointmode'
            },
            {
                type: 'split'
            },
            {
                name: 'upshape',
                title: '上移一层',
                ico: 'upshape',
                disabled: true
            },
            {
                name: 'downshape',
                title: '下移一层',
                ico: 'downshape',
                disabled: true
            },
            {
                name: 'reversepoints',
                title: '改变方向',
                ico: 'reversepoints',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'horizontalalignshapes',
                title: '左对齐',
                ico: 'alignleft',
                align: 'left',
                disabled: true
            },
            {
                name: 'horizontalalignshapes',
                title: '居中对齐',
                ico: 'aligncenter',
                align: 'center',
                disabled: true
            },
            {
                name: 'horizontalalignshapes',
                title: '右对齐',
                ico: 'alignright',
                align: 'right',
                disabled: true
            },
            {
                name: 'verticalalignshapes',
                title: '顶端对齐',
                ico: 'aligntop',
                align: 'ascent',
                disabled: true
            },
            {
                name: 'verticalalignshapes',
                title: '居中对齐',
                ico: 'alignmiddle',
                align: 'middle',
                disabled: true
            },
            {
                name: 'verticalalignshapes',
                title: '底端对齐',
                ico: 'aligndescent',
                align: 'descent',
                disabled: true
            },
            {
                name: 'verticalalignshapes',
                title: '基线对齐',
                ico: 'alignbaseline',
                align: 'baseline',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'rotateleft',
                title: '向左旋转',
                ico: 'rotateleft',
                disabled: true
            },
            {
                name: 'rotateright',
                title: '向右旋转',
                ico: 'rotateright',
                disabled: true
            },
            {
                name: 'flipshapes',
                title: '翻转',
                ico: 'flip',
                disabled: true
            },
            {
                name: 'mirrorshapes',
                title: '镜像',
                ico: 'mirror',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'splitshapes',
                title: '切割轮廓',
                ico: 'splitshapes'
            },
            {
                name: 'joinshapes',
                title: '合并轮廓',
                ico: 'joinshapes',
                disabled: true
            },
            {
                name: 'intersectshapes',
                title: '相交轮廓',
                ico: 'intersectshapes',
                disabled: true
            },
            {
                name: 'tangencyshapes',
                title: '相切轮廓',
                ico: 'tangencyshapes',
                disabled: true
            }
        ];
    }
);
