/**
 * @file 右键菜单
 * @author mengke01(kekee000@gmail.com)
 */

function createPopup(container, options) {
    let menu = document.createElement('ul');
    menu.className = options.className || 'editor-contextmenu';
    menu.style.position = 'absolute';
    menu.style.zIndex = options.zIndex || 1000;
    menu.style.display = 'none';
    container.appendChild(menu);
    return menu;
}

export default class ContextMenu {

    /**
     * 弹出菜单
     *
     * @constructor
     * @param {HTMLElement} container 主元素
     * @param {Object} options 选项参数
     */
    constructor(container, options) {
        this.container = container || document.body;
        this.main = createPopup(this.container, options || {});
        this.commands = {};

        let me = this;
        me._commandClick = function (e) {

            let id = e.target.getAttribute('data-id');
            let superId = e.target.getAttribute('data-super');
            if (id) {
                let command = (superId ? me.commands[superId].items : me.commands)[id];
                let event = {
                    command: command.name,
                    args: command,
                    pos: me.pos
                };
                me.onClick && me.onClick(event);
            }
        };
        me.main.addEventListener('click', me._commandClick, false);

        me._hideClick = function () {
            me.hide();
        };
    }

    /**
     * 设置命令集合
     *
     * @param {Object} commands 命令集合
     */
    setCommands(commands) {
        let str = '';
        commands.forEach(function (command, index) {
            if (command.items) {
                str += '<li data-sub="' + index + '">';
                str += '<ul>';
                command.items.forEach(function (subCommand, subIndex) {
                    str += '<li data-super="' + index + '" data-id="' + subIndex + '"'
                        +  (subCommand.selected ? ' data-tag="selected"' : '') + '>'
                        +  subCommand.title + '</li>';
                });
                str += '</ul>';
                str += command.title + '</li>';

            }
            else {
                str += '<li data-id="' + index + '"'
                    +   (command.selected ? ' data-tag="selected"' : '') + '>'
                    + command.title + '</li>';
            }

        });
        this.commands = commands;
        this.main.innerHTML = str;
    }

    /**
     * 展示右键菜单
     *
     * @param {Object} p 当前位置
     * @param {Array} commands 命令数组
     */
    show(p, commands) {
        if (commands) {
            this.setCommands(commands);
        }

        this._visible = true;
        this.main.style.display = 'block';
        let maxWidth = this.container.clientWidth;
        let maxHeight = this.container.clientHeight;
        let width = this.main.offsetWidth;
        let height = this.main.offsetHeight;

        let x = p.x + width > maxWidth ? maxWidth - width : p.x;
        let y = p.y + height > maxHeight ? maxHeight - height : p.y;

        this.main.style.left = x + 'px';
        this.main.style.top = y + 'px';
        this.pos = p;

        this.container.addEventListener('click', this._hideClick);
    }

    /**
     * 隐藏右键菜单
     */
    hide() {
        this._visible = false;
        this.main.style.display = 'none';
        this.onClick = null;
        this.container.removeEventListener('click', this._hideClick);
    }

    /**
     * 是否打开
     *
     * @return {boolean} 是否
     */
    visible() {
        return null == this._visible
            ? (this._visible = this.main.style.display !== 'none') : this._visible;
    }

    /**
     * 注销
     */
    dispose() {
        this.hide();
        this.main.removeEventListener('click', this._commandClick);
        this.container.removeEventListener('click', this._hideClick);
        this._commandClick = this._hideClick = null;
        this.main.remove();
        this.main = this.container = this.pos = null;
        this.onClick = null;
    }
}
