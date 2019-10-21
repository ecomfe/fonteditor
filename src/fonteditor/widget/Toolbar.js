/**
 * @file 命令菜单栏
 * @author mengke01(kekee000@gmail.com)
 */

import observable from 'common/observable';

function makeHash(stringArray) {
    let hash = {};
    for (let i = 0, l = stringArray.length; i < l; i++) {
        if (stringArray[i]) {
            hash[stringArray[i]] = true;
        }
    }
    return hash;
}

function init() {
    let me = this;
    this.main.on('click', '[data-id]', function (e) {

        if (this.getAttribute('data-disabled')) {
            return;
        }

        let id = this.getAttribute('data-id');
        let command = me.commands[id];
        if (command) {
            let name = command.name;

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

export default class CommandMenu {

    /**
     * 命令菜单栏
     *
     * @constructor
     * @param {HTMLElement} main 主元素
     * @param {Object} options 参数选项
     * @param {Array} options.commands 命令数组
     */
    constructor(main, options = {}) {
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
    setCommands(commands) {
        commands = commands || this.commands;
        let str = '';
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
    }

    /**
     * 设置命令不可用
     *
     * @param {Array} commands 命令hash集合
     * @return {this}
     */
    disableCommands(commands) {
        let list = this.main.find('[data-id]');
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
    }

    /**
     * 设置命令可用
     *
     * @param {Array} commands 命令hash集合
     * @return {this}
     */
    enableCommands(commands) {
        let list = this.main.find('[data-id]');
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
    }

    /**
     * 移除指定命令
     *
     * @param {Array} commands 命令hash集合
     * @return {this}
     */
    removeCommands(commands) {
        if (commands) {
            commands = makeHash(commands);
            for (let i = this.commands.length; i >= 0; i--) {
                let item = this.commands[i];
                if (commands[item.name]) {
                    this.commands.splice(i, 1);
                    this.main.find('[data-id="' + i + '"]').remove();
                }
            }
        }

        return this;
    }


    /**
     * 显示
     * @return {this}
     */
    show() {
        this.main.show();
        return this;
    }

    /**
     * 隐藏
     * @return {this}
     */
    hide() {
        this.main.hide();
        return this;
    }

    /**
     * 注销
     */
    dispose() {
        this.main.un('click', '[data-id]');
        this.main = null;
        this.commands = null;
    }

}

observable.mixin(CommandMenu.prototype);
