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
        var setting= require('./setting');

        /**
         * 绑定editor编辑器
         */
        function bindEditor() {

            // 设置字形信息
            var editor  = this.editor;
            editor.on('setting:font', function(e) {
                !new setting['glyf']({
                    onChange: function(setting) {
                        editor.adjustFont(setting);
                    }
                }).show(e.setting);
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
            else {
                this.editor.reset();
            }

            this.editor.focus();
            this.editing = true;
        };

        GLYFEditor.prototype.hide = function() {
            this.editor && this.editor.blur();
            this.main.hide();
            this.editing = false;
        };

        GLYFEditor.prototype.isEditing = function() {
            return this.editing;
        };

        GLYFEditor.prototype.isVisible = function() {
            return this.main.get(0).style.display !== 'none';
        };

        GLYFEditor.prototype.focus = function() {
            this.editing = true;
            this.editor && this.editor.focus();
        };

        GLYFEditor.prototype.blur = function() {
            this.editing = false;
            this.editor && this.editor.blur();
        };

        GLYFEditor.prototype.dispose = function() {
            this.editor.dispose();
            this.main = this.options = this.editor = null;
        };

        // 导出editor的函数
        ['reset','setFont', 'getFont', 'addContours', 'isChanged', 'setAxis', 'adjustFont'].forEach(function(fn) {
            GLYFEditor.prototype[fn] = function() {
                return this.editor ? this.editor[fn].apply(this.editor, arguments) : undefined;
            };
        });

        return GLYFEditor;
    }
);
