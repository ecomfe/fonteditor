/**
 * @file GLYFEditor.js
 * @author mengke01
 * @date 
 * @description
 * 编辑器组件
 */


define(
    function(require) {

        var editor = require('editor/main');


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
            if (!this.editor) {
                this.editor = editor.create(this.main.get(0));
            }
            this.main.show();
            if (font) {
                this.editor.setFont(font);
            }
            this.editor.focus();
            this.editing = true;
        };

        GLYFEditor.prototype.hide = function() {
            this.editor.blur();
            this.main.hide();
            this.editing = false;
        };

        GLYFEditor.prototype.isEditing = function() {
            return this.editing;
        };

        // 导出editor的函数
        ['focus', 'blur', 'setFont', 'getFont', 'setShapes', 'getShapes'].forEach(function(fn) {
            GLYFEditor.prototype[fn] = function() {
                return this.editor ? this.editor[fn].apply(this.editor, arguments) : undefined;
            };
        });

        return GLYFEditor;
    }
);
