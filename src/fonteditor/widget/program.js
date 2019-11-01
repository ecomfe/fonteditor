/**
 * @file 程序运行时组件
 * @author mengke01(kekee000@gmail.com)
 */

import observable from 'common/observable';
import loading from './loading';

function bindClick(components) {
    let me = this;

    document.body.addEventListener('click', function (e) {

        if (!me.listening) {
            return;
        }

        // 监听查看器
        if (components.viewer === e.target || components.viewer.contains(e.target)) {
            me.viewer.focus();
        }
        else {
            me.viewer.blur();
        }

        // 监听编辑器
        if (components.editor) {
            if (components.editor === e.target || components.editor.contains(e.target)) {
                me.editor.focus();
            }
            else {
                me.editor.blur();
            }
        }
    });
}

/**
 * 绑定键盘事件
 */
function bindKey() {
    let me = this;

    document.body.addEventListener('keydown', function (e) {

        if (!me.listening) {
            return;
        }

        e.ctrl = e.ctrlKey || e.metaKey;

        // 全选
        if (65 === e.keyCode && e.ctrl) {
            e.preventDefault();
            e.stopPropagation();
        }
        // 功能键
        if (e.keyCode >= 112 && e.keyCode <= 119 && e.keyCode !== 116) {
            e.preventDefault();
            e.stopPropagation();
            me.fire('function', {
                keyCode: e.keyCode
            });
        }
        // 保存
        else if (83 === e.keyCode && e.ctrl) {
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                me.fire('save', {
                    saveType: 'force'
                });
            }
            else {
                me.fire('save');
            }
        }
        // 粘贴
        else if ((86 === e.keyCode && e.ctrl)) {
            e.preventDefault();
            e.stopPropagation();
            me.fire('paste');
        }
    });
}

const program = {

    /**
     * 初始化
     *
     * @param {HTMLElement} components 主面板元素
     */
    init(components) {
        bindClick.call(this, components);
        bindKey.call(this, components);
    },

    /**
     * 暂存对象
     *
     * @type {Object}
     */
    data: {},
    setting: {},
    listening: true, // 正在监听事件
    loading // loading 对象
};

observable.mixin(program);

export default program;
