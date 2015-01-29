/**
 * @file 鼠标拖选组件
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var MouseCapture = require('render/capture/Mouse');

        /**
         * 获取选择范围内元素
         *
         * @param {Object} bound 边界对象
         * @return {Array} 范围内元素
         */
        function getRangeItem(bound) {
            var elements = [];
            this.main.children().each(function (i, element) {
                var item = $(element);
                var pos = item.offset();
                var p = {
                    x: pos.left + item.width() / 2,
                    y: pos.top + item.height() / 2
                };

                if (p.x >= bound.x && p.x <= bound.x + bound.width
                    && p.y >= bound.y && p.y <= bound.y + bound.height
                ) {
                    elements.push(element);
                }
            });

            return elements;
        }

        function init() {

            var me = this;
            me.capture = new MouseCapture(me.main.get(0), {
                events: {
                    dblclick: false,
                    mousewheel: false,
                    mouseover: false,
                    mouseout: false
                }
            });

            me.capture.on('dragstart', function (e) {
                me.rangeElement.show();
                me.main.addClass('no-hover');
                me.startX = e.originEvent.pageX;
                me.startY = e.originEvent.pageY;
            });

            var dragging = function (e) {
                var x = e.originEvent.pageX;
                var y = e.originEvent.pageY;
                me.rangeElement.css({
                    left: Math.min(me.startX, x),
                    top: Math.min(me.startY, y),
                    width: Math.abs(me.startX - x),
                    height: Math.abs(me.startY - y)
                });
            };
            me.capture.on('drag', dragging);

            me.capture.on('dragend', function (e) {
                me.rangeElement.hide();
                me.main.removeClass('no-hover');

                var x = e.originEvent.pageX;
                var y = e.originEvent.pageY;
                var width = Math.abs(me.startX - x);
                var height = Math.abs(me.startY - y);
                if (width < 20 && height < 20) {
                    return;
                }

                e.items = getRangeItem.call(me, {
                    x: Math.min(me.startX, x),
                    y: Math.min(me.startY, y),
                    width: width,
                    height: height
                });

                me.onSelect && me.onSelect(e);
            });
        }

        /**
         * 拖选组件
         *
         * @param {HTMLElement} main    主元素
         * @param {Object} options 参数
         * @param {HTMLElement} options.rangeElement range元素
         * @param {Function} onSelect 选择事件 onSelect(e)
         */
        function DragSelector(main, options) {
            this.main = $(main);
            this.rangeElement = $(options.rangeElement || '#selection-range');
            this.onSelect = options.onSelect;
            init.call(this);
        }

        DragSelector.prototype.dispose = function () {
            this.capture.dispose();
            this.main = this.rangeElement = this.capture = null;
        };

        return DragSelector;
    }
);

