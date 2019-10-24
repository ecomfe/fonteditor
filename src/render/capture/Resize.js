/**
 * @file 窗口大小改变捕获器
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';
import observable from 'common/observable';

/**
 * 获取事件参数
 *
 * @param {MouseEvent} e 事件
 * @return {Object} 事件参数
 */
function getEvent(e) {
    return {
        originEvent: e
    };
}

/**
 * 窗口大小改变处理
 *
 * @param {Object} e 事件参数
 */
function resizedetect(e) {

    if (false === this.events.resize) {
        return;
    }

    let event = getEvent(e);
    this.fire('resize', event);
}

export default class ResizeCapture {

    /**
     * 窗口大小改变捕获器
     *
     * @constructor
     * @param {HTMLElement} main 控制元素
     * @param {Object} options 参数选项
     * @param {HTMLElement} options.main 监控对象
     */
    constructor(main, options = {}) {
        this.main = main;
        this.events = options.events || {};
        this.debounce = options.debounce || 200;
        this.handlers = {
            resize: lang.debounce(resizedetect.bind(this), this.debounce)
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
            window.addEventListener('resize', this.handlers.resize, false);
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
            window.removeEventListener('resize', this.handlers.resize);
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

observable.mixin(ResizeCapture.prototype);
