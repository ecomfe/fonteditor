/**
 * @file 键盘捕获器
 * @author mengke01(kekee000@gmail.com)
 */

import observable from 'common/observable';

// 键盘名称映射表
const keyCodeMap = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    13: 'enter',
    27: 'esc',
    8: 'backspace',
    45: 'insert',
    46: 'delete',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    36: 'home',
    47: 'help',
    20: 'caps',
    9: 'tab'
};


/**
 * 获取事件参数
 *
 * @param {MouseEvent} e 事件
 * @return {Object} 事件参数
 */
function getEvent(e) {
    return {
        keyCode: e.keyCode,
        key: keyCodeMap[e.keyCode],
        ctrlKey: e.ctrlKey || e.metaKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        originEvent: e
    };
}

/**
 * 按下弹起事件
 *
 * @param {Object} keyEventName 事件名称
 * @param {Object} e 事件参数
 */
function keydetect(keyEventName, e) {

    if (false === this.events['key' + Event]) {
        return;
    }

    let event = getEvent(e);
    this.fire('key' + keyEventName, event);

    let keyName = keyCodeMap[event.keyCode];
    if (keyName) {
        this.fire(keyName + ':' + keyEventName, event);
    }
}


export default class KeyboardCapture {

    constructor(main, options = {}) {
        this.main = main;
        options = options || {};
        this.events = options.events || {};

        this.handlers = {
            keydown: keydetect.bind(this, 'down'),
            keyup: keydetect.bind(this, 'up'),
            keypress: keydetect.bind(this, 'press')
        };

        this.start();
    }

    /**
     * 开始监听
     *
     * @return {this}
     */
    start() {
        if (!this.listening) {
            this.listening = true;
            let target = document.body;
            target.addEventListener('keydown', this.handlers.keydown, false);
            target.addEventListener('keyup', this.handlers.keyup, false);
            target.addEventListener('keypress', this.handlers.keypress, false);
        }

        return this;
    }

    /**
     * 停止监听
     *
     * @return {this}
     */
    stop() {

        if (this.listening) {
            this.listening = false;
            let target = document.body;
            target.removeEventListener('keydown', this.handlers.keydown);
            target.removeEventListener('keyup', this.handlers.keyup);
            target.removeEventListener('keypress', this.handlers.keypress);
        }
        return this;
    }

    /**
     * 是否监听中
     *
     * @return {boolean} 是否
     */
    isListening() {
        return !!this.listening;
    }

    /**
     * 注销
     */
    dispose() {
        this.stop();
        this.main = this.events = null;
        this.un();
    }
}

observable.mixin(KeyboardCapture.prototype);
