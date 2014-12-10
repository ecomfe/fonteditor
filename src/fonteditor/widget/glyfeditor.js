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

        /**
         * 绑定editor编辑器
         */
        function bindEditor() {

            // 设置字形信息
            var me = this;
            var editor  = this.editor;
            editor.on('setting:font', function(e) {
                !new setting['glyf']({
                    onChange: function(setting) {
                        editor.adjustFont(setting);
                        // 此处需要等待点击完成后设置focus状态
                        setTimeout(function() {
                            me.focus();
                        });
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
            this.options = options || {};
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
         * 设置项目
         * @param {Object} options 参数集合
         */
        GLYFEditor.prototype.setSetting = function(options) {
            if (this.editor) {
                this.editor.setOptions(options);
            }
            else {
                editorOptions.editor = options;
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
