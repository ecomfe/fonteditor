/**
 * @file 命令菜单栏
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var observable = require('common/observable');

        function makeHash(stringArray) {
            var hash = {};
            for (var i = 0, l = stringArray.length; i < l; i++) {
                if (stringArray[i]) {
                    hash[stringArray[i]] = true;
                }
            }
            return hash;
        }

        function init() {
            var me = this;
            this.main.on('click', '[data-id]', function (e) {

                if (this.getAttribute('data-disabled')) {
                    return;
                }

                var id = this.getAttribute('data-id');
                var command = me.commands[id];
                if (command) {
                    var name = command.name;

                    if (command.type === 'toggle') {
                        if (command.on) {
                            this.removeAttribute('data-on');
                            command.on = false;
                            me.fire('command:un', {
                                command: name,
                                args: command
                            });
                            return;
                        }

                        this.setAttribute('data-on', 1);
                        command.on = true;
                    }

                    me.fire('command', {
                        command: name,
                        args: command
                    });
                }
            });
        }

        /**
         * 命令菜单栏
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数选项
         * @param {Array} options.commands 命令数组
         */
        function CommandMenu(main, options) {
            options = options || {};
            this.main = $(main);
            this.commands = options.commands || [];
            init.call(this);
            if (this.commands.length) {
                this.setCommands();
            }
        }

        /**
         * 设置命令集合
         *
         * @param {Array} commands 命令集合
         * @return {this}
         */
        CommandMenu.prototype.setCommands = function (commands) {
            commands = commands || this.commands;
            var str = '';
            commands.forEach(function (item, i) {

                if (item.type === 'split') {
                    str += '<li data-id="-1" data-split="1"></li>';
                }
                else {

                    str += '<li data-id="' + i + '"'
                        + (item.disabled ? ' data-disabled="1"' : '')
                        + (item.on ? ' data-on="1"' : '')
                        + (item.ico ? 'data-theme="ico" title="' + item.title + '"' : '')
                        + '>';

                    if (item.ico) {
                        str += '<i class="ico i-' + item.ico + '"></i>';
                    }
                    else {
                        str += item.title
                            + (item.quickKey ? '(<i>' + item.quickKey + '</i>)' : '');
                    }

                    str += '</li>';
                }
            });

            this.main.html(str);
            this.commands = commands;

            return this;
        };

        /**
         * 设置命令不可用
         *
         * @param {Array} commands 命令hash集合
         * @return {this}
         */
        CommandMenu.prototype.disableCommands = function (commands) {
            var list = this.main.find('[data-id]');
            if (commands) {
                commands = makeHash(commands);
                this.commands.forEach(function (item, i) {
                    if (commands[item.name]) {
                        item.disabled = true;
                        $(list[i]).attr('data-disabled', 1);
                    }
                });
            }
            return this;
        };

        /**
         * 设置命令可用
         *
         * @param {Array} commands 命令hash集合
         * @return {this}
         */
        CommandMenu.prototype.enableCommands = function (commands) {
            var list = this.main.find('[data-id]');
            if (commands) {
                commands = makeHash(commands);
                this.commands.forEach(function (item, i) {
                    if (commands[item.name]) {
                        delete item.disabled;
                        $(list[i]).attr('data-disabled', null);
                    }
                });
            }
            return this;
        };

        /**
         * 移除指定命令
         *
         * @param {Array} commands 命令hash集合
         * @return {this}
         */
        CommandMenu.prototype.removeCommands = function (commands) {
            if (commands) {
                commands = makeHash(commands);
                for (var i = this.commands.length; i >= 0; i--) {
                    var item = this.commands[i];
                    if (commands[item.name]) {
                        this.commands.splice(i, 1);
                        this.main.find('[data-id="' + i + '"]').remove();
                    }
                }
            }

            return this;
        };


        /**
         * 显示
         * @return {this}
         */
        CommandMenu.prototype.show = function () {
            this.main.show();
            return this;
        };

        /**
         * 隐藏
         * @return {this}
         */
        CommandMenu.prototype.hide = function () {
            this.main.hide();
            return this;
        };

        /**
         * 注销
         */
        CommandMenu.prototype.dispose = function () {
            this.main.un('click', '[data-id]');
            this.main = null;
            this.commands = null;
        };

        observable.mixin(CommandMenu.prototype);

        return CommandMenu;
    }
);
