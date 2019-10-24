/**
 * @file 面板分割管理器
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';
import observable from 'common/observable';

function init(spliter) {
    const fireChange = lang.throttle(function (e) {
        if (!e) {
            return;
        }
        let offset = e.pageX - spliter.x;
        let deltaX = e.pageX - spliter.deltaX;
        spliter.deltaX = e.pageX;
        if (deltaX) {
            spliter.fire('change', {
                offset: offset,
                delta: deltaX
            });
        }
    }, 200);

    function onMouseMove(e) {
        fireChange(e);
    }

    function onMouseUp(e) {
        spliter.cover.remove();
        fireChange(e);
        $(window).off('mousemove', onMouseMove)
            .off('mouseup', onMouseUp);
    }

    spliter.onMouseDown = function (e) {
        spliter.deltaX = spliter.x = e.pageX;
        spliter.cover.appendTo(document.body);
        $(window).on('mousemove', onMouseMove)
            .on('mouseup', onMouseUp);
    };

    spliter.enable();
}

export default class Spliter {

    /**
     * 面板分割管理器
     *
     * @constructor
     * @param {HTMLElement} main 主元素
     * @param {Object} options 参数
     */
    constructor(main) {
        this.main = $(main);
        let cover = '<div style="'
            + 'position:fixed;z-index: 100;width: 100%;height: 100%;left:0;top:0;cursor:e-resize"></div>';
        this.cover = $(cover);
        init(this);
    }

    enable() {
        if (!this.isEnabled) {
            this.isEnabled = true;
            this.main.css('cursor', 'e-resize').on('mousedown', this.onMouseDown);
        }
        return this;
    }

    disable() {
        if (this.isEnabled) {
            delete this.isEnabled;
            this.main.css('cursor', '').off('mousedown', this.onMouseDown);
        }
        return this;
    }

    dispose() {
        this.disable();
        this.cover.remove();
        this.main = this.cover = null;
    }

}

observable.mixin(Spliter.prototype);
