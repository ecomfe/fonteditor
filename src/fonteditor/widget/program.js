/**
 * @file program.js
 * @author mengke01
 * @date
 * @description
 * 程序运行时组件
 */


define(
    function (require) {

        var observable = require('common/observable');


        function bindClick(components) {
            var me = this;

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
            var me = this;

            document.body.addEventListener('keydown', function (e) {

                if (!me.listening) {
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
                else if ((86 === e.keyCode && e.ctrlKey)) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.fire('paste');
                }
            });
        }

        var program = {

            // 在线地址读取接口
            readOnline: (
                location.hostname.indexOf('baidu.com') >= 0
                ? '/font/proxy?type=${0}&url=${1}'
                : './php/readOnline.php?type=${0}&file=${1}'
            ),

            /**
             * 初始化
             *
             * @param {HTMLElement} components 主面板元素
             */
            init: function (components) {
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

            loading: require('./loading') // loading 对象
        };

        observable.mixin(program);

        return program;
    }
);
