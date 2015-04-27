/**
 * @file glyf列表相关命令
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        return [
            {
                name: 'copy',
                title: '复制',
                quickKey: 'C',
                disabled: true
            },
            {
                name: 'cut',
                title: '剪切',
                quickKey: 'X'
            },
            {
                name: 'paste',
                title: '粘贴',
                quickKey: 'V'
            },
            {
                name: 'del',
                title: '删除',
                quickKey: 'D',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'adjust-pos',
                title: '调整位置'
            },
            {
                name: 'adjust-glyf',
                title: '调整字形'
            },
            {
                name: 'setting-font',
                title: '字形信息',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'find-glyf',
                title: '查找字形'
            },
            {
                name: 'setting-unicode',
                title: '设置代码点'
            },
            {
                name: 'setting-sync',
                title: '同步字体'
            }
        ];
    }
);
