/**
 * @file GLYFEditor.js
 * @author mengke01
 * @date
 * @description
 * 编辑器组件
 */


define(
    function(require) {

        var editorFactory = require('editor/main');
        var editorOptions = require('editor/options');
        var setting = require('./setting');
        var program = require('./program');
        var lang = require('common/lang');


        // 支持的命令列表
        var COMMAND_SUPPORT = {
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
            var me = this;
            var editor  = this.editor;
            var delayFocus = lang.debounce(function() {
                me.focus();
            }, 20);

            editor.on('setting:font', function(e) {
                !new setting['glyf']({
                    onChange: function(setting) {
                        editor.adjustFont(setting);
                        // 此处需要等待点击完成后设置focus状态
                        delayFocus();
                    }
                }).show(e.setting);
            });

            editor.on('setting:editor', function(e) {
                var dlg = new setting.editor({
                    onChange: function(setting) {
                        setTimeout(function() {
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

            editor.on('save', function() {
                program.fire('save', {
                    type: 'editor'
                });
            });

            var commandMenu = this.commandMenu;
            if (commandMenu) {

                editor.on('selection:change', lang.debounce(function(e) {
                    var length = e.shapes ? e.shapes.length : 0;
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

                commandMenu.on('command', function(e) {

                    // 这里延时进行focus
                    delayFocus();

                    var command = e.command;
                    var args = e.args;
                    var shapes;

                    if (command === 'save') {
                        program.fire('save', {
                            type: 'editor'
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
                            case 'copyshapes':
                            case 'removeshapes':
                            case 'reversepoints':
                            case 'joinshapes':
                            case 'intersectshapes':
                            case 'tangencyshapes':
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

        /**
         * 执行指定命令
         *
         * @param {string} command 命令名
         */
        function execCommand(command) {
            if (this.editor) {
                this.editor.execCommand.apply(this.editor, arguments);
            }
        }

        /**
         * font查看器
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         */
        function GLYFEditor(main, options) {

            this.main = $(main);
            this.options = lang.extend({}, options);

            if (this.options.commandMenu) {
                this.commandMenu = this.options.commandMenu;
                delete this.options.commandMenu;
            }
        }

        /**
         * 显示
         */
        GLYFEditor.prototype.show = function(font) {
            // 这里注意显示顺序，否则editor创建的时候计算宽度会错误
            this.main.show();

            if (!this.editor) {
                this.editor = editorFactory.create(this.main.get(0));
                bindEditor.call(this);
            }

            if (font) {
                this.editor.setFont(font);
            }

            this.editor.refresh();
            this.editing = true;
        };

        /**
         * 隐藏
         */
        GLYFEditor.prototype.hide = function() {
            this.editor && this.editor.blur();
            this.main.hide();
            this.editing = false;
        };

        /**
         * 是否编辑中
         */
        GLYFEditor.prototype.isEditing = function() {
            return this.editing;
        };

        /**
         * 是否可见
         */
        GLYFEditor.prototype.isVisible = function() {
            return this.main.get(0).style.display !== 'none';
        };

        /**
         * 获取焦点
         */
        GLYFEditor.prototype.focus = function() {
            this.editing = true;
            this.editor && this.editor.focus();
        };

        /**
         * 失去焦点
         */
        GLYFEditor.prototype.blur = function() {
            this.editing = false;
            this.editor && this.editor.blur();
        };

        /**
         * 撤销
         */
        GLYFEditor.prototype.undo = function() {
            execCommand.call(this, 'undo');
        };

        /**
         * 重做
         */
        GLYFEditor.prototype.redo = function() {
            execCommand.call(this, 'redo');
        };

        /**
         * 设置项目
         * @param {Object} options 参数集合
         */
        GLYFEditor.prototype.setSetting = function(options) {
            if (this.editor) {
                this.editor.setOptions(options);
            }
            else {
               lang.overwrite(editorOptions.editor, options);
            }
        };

        /**
         * 获取设置项目
         */
        GLYFEditor.prototype.getSetting = function() {
            return this.editor ? this.editor.options : editorOptions.editor;
        };

        /**
         * 注销
         */
        GLYFEditor.prototype.dispose = function() {
            this.editor.dispose();
            this.main = this.options = this.editor = null;
        };

        // 导出editor的函数
        ['reset','setFont', 'getFont', 'addContours', 'isChanged', 'setChanged', 'setAxis', 'adjustFont'].forEach(function(fn) {
            GLYFEditor.prototype[fn] = function() {
                return this.editor ? this.editor[fn].apply(this.editor, arguments) : undefined;
            };
        });

        return GLYFEditor;
    }
);
