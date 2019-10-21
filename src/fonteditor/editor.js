/**
 * @file 编辑器导出接口，用于编辑字形相关的矢量图形
 * @author mengke01(kekee000@gmail.com)
 */
import 'css/editor.less';

import lang from 'common/lang';
import editor from '../editor/main';
import options from '../editor/options';
import commandList from '../editor/menu/commandList';

// 用来做跨域通信的密钥
const EDITOR_KEY = lang.parseQuery(location.search.slice(1)).key || 'fonteditor';

function fireEvent(name, data, stamp) {
    // 向引用方外部发送事件
    parent.postMessage({
        key: EDITOR_KEY,
        name: name,
        stamp: stamp,
        data: data || null
    }, '*');
    return this;
}

function onMessage() {
    window.addEventListener('message', function (e) {
        if (!e.data.key === EDITOR_KEY) {
            return;
        }

        let name = e.data.name;
        let args = e.data.data;
        if (typeof window.editor[name] === 'function') {
            let data = window.editor[name].apply(window.editor, args);
            if (e.data.stamp) {
                fireEvent(name, data === window.editor ? null : data, e.data.stamp);
            }
        }
    });
}

function removeCommandMenu(name, menu) {
    for (let i = menu.length - 1; i >= 0; i--) {
        if (menu[i].name === name) {
            menu.splice(i, 1);
            return true;
        }
        else if (menu[i].items) {
            if (removeCommandMenu(name, menu[i].items)) {
                return true;
            }
        }
    }
    return false;
}

function initEditor() {
    removeCommandMenu('fontsetting', commandList.editor);
    removeCommandMenu('save', commandList.editor);
    removeCommandMenu('moresetting', commandList.editor);

    options.editor.unitsPerEm = 1024;
    options.editor.axis.metrics = {
        ascent: 812, // 上升
        descent: -212, // 下降
        xHeight: 400, // x高度
        capHeight: 700 // 大写字母高度
    };
    let context = editor.create($('#editor-panel').get(0), options);
    return context;
}

function main() {
    // 由于editor会在iframe中嵌入，组件会阻止默认的`click`事件，
    // 导致无法获取焦点，然后键盘事件失效，这里需要监听window事件，手动focus
    window.addEventListener('mousedown', function () {
        if (!window.isFocused) {
            window.focus();
            window.isFocused = true;
        }
    }, true);
    onMessage();
    let context = initEditor();
    context.focus();
    window.editor = context;
    fireEvent('load');
}

// entry
main();
