/**
 * @file 字形编辑器
 * @author mengke01(kekee000@gmail.com)
 */

import editorFactory from 'editor/main';
import editorOptions from 'editor/options';
import settingSupport from '../dialog/support';
import program from './program';
import lang from 'common/lang';


// 支持的命令列表
const COMMAND_SUPPORT = {
    // 形状组
    shapes: [
        'copyshapes', 'removeshapes', 'reversepoints',
        'horizontalalignshapes', 'verticalalignshapes',
        'rotateleft', 'rotateright', 'flipshapes', 'mirrorshapes'
    ],
    shapes2: [
        'joinshapes', 'intersectshapes', 'tangencyshapes'
    ],
    // 单个形状
    shape: ['pointmode', 'upshape', 'downshape']
};


/**
 * 绑定editor编辑器
 */
function bindEditor() {

    // 设置字形信息
    let me = this;
    let editor  = this.editor;
    let delayFocus = lang.debounce(function () {
        me.focus();
    }, 20);

    editor.on('setting:font', function (e) {
        let SettingGlyf = settingSupport.glyf;
        !new SettingGlyf({
            onChange(setting) {
                editor.adjustFont(setting);
                // 此处需要等待点击完成后设置focus状态
                delayFocus();
            }
        }).show(e.setting);
    });

    editor.on('setting:editor', function (e) {
        let SettingEditor = settingSupport.editor;
        let dlg = new SettingEditor({
            onChange(setting) {
                setTimeout(function () {
                    program.viewer.setSetting(setting.viewer);
                    me.setSetting(setting.editor);
                }, 20);
            }
        });
        dlg.show({
            viewer: program.viewer.getSetting(),
            editor: e.setting
        });
    });

    let commandMenu = this.commandMenu;
    if (commandMenu) {

        editor.on('selection:change', lang.debounce(function (e) {
            let length = e.shapes ? e.shapes.length : 0;
            if (!length) {
                commandMenu.disableCommands(COMMAND_SUPPORT.shapes);
                commandMenu.disableCommands(COMMAND_SUPPORT.shapes2);
                commandMenu.disableCommands(COMMAND_SUPPORT.shape);
            }
            else {
                commandMenu.enableCommands(COMMAND_SUPPORT.shapes);
                commandMenu[length >= 2 ? 'enableCommands' : 'disableCommands'](COMMAND_SUPPORT.shapes2);
                commandMenu[length === 1 ? 'enableCommands' : 'disableCommands'](COMMAND_SUPPORT.shape);
            }
        }), 100);

        commandMenu.on('command', function (e) {

            // 这里延时进行focus
            delayFocus();

            let command = e.command;
            let args = e.args;
            let shapes;

            if (command === 'save') {
                program.fire('save', {
                    saveType: 'editor'
                });
                return;
            }

            if (command === 'splitshapes') {
                editor.setMode('split');
                return;
            }

            if (command === 'pasteshapes') {
                shapes = editor.getClipBoard();
            }
            else {
                shapes = editor.getSelected();
            }

            if (shapes && shapes.length) {
                switch (command) {
                    case 'pointmode':
                        editor.setMode('point', shapes[0]);
                        break;
                    case 'topshape':
                    case 'bottomshape':
                    case 'upshape':
                    case 'downshape':
                        editor.execCommand(command, shapes[0]);
                        break;

                    case 'copyshapes':
                    case 'pasteshapes':
                    case 'removeshapes':
                    case 'joinshapes':
                    case 'intersectshapes':
                    case 'tangencyshapes':
                    case 'rotateleft':
                    case 'rotateright':
                    case 'flipshapes':
                    case 'mirrorshapes':
                    case 'cutshapes':
                    case 'reversepoints':
                        editor.execCommand(command, shapes);
                        break;

                    case 'alignshapes':
                    case 'verticalalignshapes':
                    case 'horizontalalignshapes':
                        editor.execCommand(command, shapes, args.align);
                        break;
                }
            }
            else if (command === 'rangemode') {
                editor.setMode('bound');
            }
        });
    }
}

export default class GLYFEditor {

        /**
         * font查看器
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         * @param {CommandMenu} options.commandMenu 命令菜单对象
         */
        constructor(main, options) {

            this.main = $(main);
            this.options = Object.assign({}, options);

            if (this.options.commandMenu) {
                this.commandMenu = this.options.commandMenu;
                delete this.options.commandMenu;
            }
        }

        /**
         * 显示
         */
        show() {
            // 这里注意显示顺序，否则editor创建的时候计算宽度会错误
            this.main.show();

            if (!this.editor) {
                this.editor = editorFactory.create(this.main.get(0));
                bindEditor.call(this);
            }

            this.editing = true;
        }

        /**
         * 隐藏
         */
        hide() {
            this.editor && this.editor.blur();
            this.main.hide();
            this.editing = false;
        }

        /**
         * 是否编辑中
         *
         * @return {boolean} 是否
         */
        isEditing() {
            return this.editing;
        }

        /**
         * 是否可见
         *
         * @return {boolean} 是否
         */
        isVisible() {
            return this.editor && this.main.get(0).style.display !== 'none';
        }

        /**
         * 获取焦点
         */
        focus() {
            this.editing = true;
            this.editor && this.editor.focus();
        }

        /**
         * 失去焦点
         */
        blur() {
            this.editing = false;
            this.editor && this.editor.blur();
        }

        /**
         * 撤销
         */
        undo() {
            this.execCommand('undo');
        }

        /**
         * 重做
         */
        redo() {
            this.execCommand('redo');
        }

        /**
         * 设置项目
         *
         * @param {Object} options 参数集合
         */
        setSetting(options) {
            if (this.editor) {
                this.editor.setOptions(options);
            }
            else {
                lang.overwrite(editorOptions.editor, options);
            }
        }

        /**
         * 获取设置项目
         *
         * @return {Object} 设置项目
         */
        getSetting() {
            return this.editor ? this.editor.options : editorOptions.editor;
        }

        /**
         * 执行指定命令
         *
         * @param {string} command 命令名
         */
        execCommand() {
            if (this.editor) {
                this.editor.execCommand.apply(this.editor, arguments);
            }
        }

        /**
         * 注销
         */
        dispose() {
            this.editor.dispose();
            this.main = this.options = this.editor = null;
        }
}

// 导出editor的函数
[
    'reset', 'setFont', 'getFont',
    'isChanged', 'setChanged', 'setAxis', 'adjustFont'
].forEach(function (fn) {
    GLYFEditor.prototype[fn] = function (...args) {
        return this.editor ? this.editor[fn].apply(this.editor, args) : undefined;
    };
});
