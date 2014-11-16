/**
 * @file ContextMenu.js
 * @author mengke01
 * @date 
 * @description
 * 右键菜单设置
 */


define(
    function(require) {

        var lang = require('common/lang');

        /**
         * 创建一个浮动层
         * 
         * @return {HTMLElement} 浮动层对象
         */
        function createPopup(container, options) {
            var menu = document.createElement('ul');
            menu.className = options.className || 'editor-contextmenu';
            menu.style.position = 'absolute';
            menu.style.zIndex = options.zIndex || 1000;
            menu.style.display = 'none';
            container.appendChild(menu);
            return menu;
        }


        /**
         * 弹出菜单
         * 
         * @constructor
         * @param {HTMLElement} container 主元素
         * @param {Object} options 选项参数
         */
        function ContextMenu(container, options) {
            this.container = container || document.body;
            this.main = createPopup(this.container, options || {});
            this.commands = {};

            var me = this;
            me.main.addEventListener('click', me['_command_click'] = function(e) {

                var id = e.target.getAttribute('data-id');
                var superId = e.target.getAttribute('data-super');
                if (id) {
                    var command = (!!superId ? me.commands[superId].items : me.commands)[id];
                    var event = {
                        command: command.name,
                        args: command,
                        pos: me.pos
                    };
                    me.onClick && me.onClick(event);
                }
            } , false);

            me['_hide_click'] = function(e) {
                me.hide();
            };
        }

        lang.extend(ContextMenu.prototype, {

            /**
             * 设置命令集合
             * 
             * @param {Object} commands 命令集合
             * 
             * @return {this}
             */
            setCommands: function(commands) {
                var str = '';
                commands.forEach(function(command, index) {
                    if (command.items) {
                        str += '<li data-sub="'+ index +'">';
                        str += '<ul>';
                        command.items.forEach(function(subCommand, subIndex) {
                            str += '<li data-super="'+ index +'" data-id="'+ subIndex +'"'
                                +   (subCommand.selected ? ' data-tag="selected"' : '') +'>'
                                + subCommand.title +'</li>';
                        });
                        str += '</ul>';
                        str += command.title + '</li>';

                    }
                    else {
                        str += '<li data-id="'+ index +'"'
                            +   (command.selected ? ' data-tag="selected"' : '') +'>'
                            + command.title +'</li>';
                    }

                });
                this.commands = commands;
                this.main.innerHTML = str;
            },

            /**
             * 展示右键菜单
             * 
             * @return {this}
             */
            show: function(p, commands) {
                if(commands) {
                    this.setCommands(commands);
                }

                this.main.style.display = 'block';
                var maxWidth = this.container.clientWidth;
                var maxHeight = this.container.clientHeight;
                var width = this.main.offsetWidth;
                var height = this.main.offsetHeight;

                var x = p.x + width > maxWidth ? maxWidth - width : p.x;
                var y = p.y + height > maxHeight ? maxHeight - height : p.y;

                this.main.style.left = x + 'px';
                this.main.style.top = y + 'px';
                this.pos = p;

                this.container.addEventListener('click', this['_hide_click']);
            },

            /**
             * 隐藏右键菜单
             * 
             * @return {this}
             */
            hide: function() {
                this.main.style.display = 'none';
                this.onClick = null;
                this.container.removeEventListener('click', this['_hide_click']);
            },

            /**
             * 是否打开
             * 
             * @return {boolean} 是否
             */
            visible: function() {
                return this.main.style.display !== 'none';
            },

            onClick: null,

            /**
             * 注销
             */
            dispose: function() {
                this.hide();
                this.main.removeEventListener('click', this['_command_click'], false);
                this.container.removeEventListener('click', this['_hide_click'], false);
                this.main.remove();
                this.main = this.container = this.pos = null;
                this['_command_click'] = this['_hide_click'] = null;
                this.onClick = null;
            }
        });

        return ContextMenu;
    }
);
