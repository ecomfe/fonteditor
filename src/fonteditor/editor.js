/**
 * @file 编辑器导出接口，用于编辑字形相关的矢量图形
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    var editor = require('../editor/main');
    var options = require('../editor/options');
    var commandList = require('../editor/menu/commandList');

    // 用来做跨域通信的密钥
    var EDITOR_KEY = require('../common/lang').parseQuery(location.search.slice(1)).key || 'fonteditor';

    /**
     * 向引用方外部发送事件
     * @param  {string} name 名称
     * @param  {Object} data 数据
     * @param  {number} stamp 某次通信的信标，用以区分多次事件
     */
    function fireEvent(name, data, stamp) {
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

            var name = e.data.name;
            var args = e.data.data;
            if (typeof window.editor[name] === 'function') {
                var data = window.editor[name].apply(window.editor, args);
                if (e.data.stamp) {
                    fireEvent(name, data === window.editor ? null : data, e.data.stamp);
                }
            }
        });
    }

    function removeCommandMenu(name, menu) {
        for (var i = menu.length - 1; i >= 0; i--) {
            if (menu[i].name === name) {
                menu.splice(i, 1);
                return true;
            }
            else if (menu[i].items) {
                if (removeCommandMenu(name, menu[i].items)) {
                    return true
                }
            }
        }
        return false;
    }

    function initEditor() {
        removeCommandMenu('fontsetting', commandList.editor)
        removeCommandMenu('save', commandList.editor)
        removeCommandMenu('moresetting', commandList.editor)

        options.editor.unitsPerEm = 1024;
        options.editor.axis.metrics = {
            ascent: 812, // 上升
            descent: -212, // 下降
            xHeight: 400, // x高度
            capHeight: 700 // 大写字母高度
        };
        var context = editor.create($('#editor-panel').get(0), options);
        return context;
    }

    function main() {
        onMessage();
        var context = initEditor();
        context.focus();
        window.editor = context;
        fireEvent('load');
    }
    main();

    return {};
});
