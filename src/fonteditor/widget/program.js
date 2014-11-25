/**
 * @file program.js
 * @author mengke01
 * @date 
 * @description
 * 程序运行时组件
 */


define(
    function(require) {

        var observable = require('common/observable');


        // 绑定click事件
        function bindClick(components) {
            var me = this;
            document.body.addEventListener('click', function(e) {

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

            }, false);
        }

        /**
         * 绑定键盘事件
         */
        function bindKey() {
            var me = this;

            document.body.addEventListener('keydown', function(e) {

                if (!program.listening) {
                    return;
                }
                
                e.ctrlKey = e.ctrlKey || e.metaKey;

                // 全选
                if (65 === e.keyCode && e.ctrlKey) {
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
                else if (83 === e.keyCode && e.ctrlKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.fire('save');
                }
                // 粘贴
                else if ((e.keyCode == 86 && e.ctrlKey)) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.fire('paste');
                }
            });
        }

        var program = {
            
            // 在线地址读取接口
            fontUrl: './php/readFont.php?file=${0}',

            /**
             * 初始化
             */
            init: function(components) {
                bindClick.call(this, components);
                bindKey.call(this, components);
            },

            /**
             * 暂存对象
             * 
             * @type {Object}
             */
            data: {},

            viewer: null, // glyf查看器

            project: null, // 项目管理器

            projectViewer: null, // 项目查看器

            ttfManager: null, // ttf管理器

            listening: true, // 正在监听事件

            loading: require('./loading')
        };

        observable.mixin(program);

        return program;
    }
);
