/**
 * @file 面板分割管理器
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    var lang = require('common/lang');

    function init(spliter) {
        spliter.onMouseDown = function (e) {
            spliter.deltaX = spliter.x = e.pageX;
            spliter.cover.appendTo(document.body);
            $(window).on('mousemove', onMouseMove)
                .on('mouseup', onMouseUp);
        };

        var fireChange = lang.throttle(function (e) {
            var offset = e.pageX - spliter.x;
            var deltaX = e.pageX - spliter.deltaX;
            spliter.deltaX = e.pageX;
            if (deltaX) {
                spliter.fire('change', {
                    offset: offset,
                    delta: deltaX
                });
            }
        }, 200);
        var onMouseMove = function (e) {
            fireChange(e);
        };

        var onMouseUp = function (e) {
            spliter.cover.remove();
            fireChange(e);
            $(window).off('mousemove', onMouseMove)
                .off('mouseup', onMouseUp);
        };

        spliter.enable();
    }

    /**
     * 面板分割管理器
     *
     * @constructor
     * @param {HTMLElement} main 主元素
     * @param {Object} options 参数
     */
    function Spliter(main) {
        this.main = $(main);
        var cover = '<div style="'
            + 'position:fixed;z-index: 100;width: 100%;height: 100%;left:0;top:0;cursor:e-resize"></div>';
        this.cover = $(cover);
        init(this);
    }

    Spliter.prototype.enable = function () {
        if (!this.isEnabled) {
            this.isEnabled = true;
            this.main.css('cursor', 'e-resize').on('mousedown', this.onMouseDown);
        }
        return this;
    };

    Spliter.prototype.disable = function () {
        if (this.isEnabled) {
            delete this.isEnabled;
            this.main.css('cursor', '').off('mousedown', this.onMouseDown);
        }
        return this;
    };

    Spliter.prototype.dispose = function () {
        this.disable();
        this.cover.remove();
        this.main = this.cover = null;
    };

    require('common/observable').mixin(Spliter.prototype);
    return Spliter;
});
