/**
 * @file glyflist.js
 * @author mengke01
 * @date 
 * @description
 * glyf 查看器
 */

define(
    function(require) {
        var glyf2svg = require('ttf/util/glyf2svg');
        var string = require('common/string');
        var lang = require('common/lang');
        var MouseCapture = require('render/capture/Mouse');

        var GLYF_ITEM_TPL = ''
            + '<div data-index="${index}" class="glyf-item ${compound} ${modify}">'
            +   '<i data-action="del" class="i-del" title="删除"></i>'
            +   '<svg class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}">'
            +       '<g transform="scale(1, -1) translate(0, -${descent}) scale(0.95, 0.95) "><path class="path" ${d}/></g></svg>'
            +   '<div data-field="unicode" class="unicode" title="${unicode}">${unicode}</div>'
            +   '<div data-field="name" class="name" title="${name}">${name}</div>'
            + '</div>';

        var keyMap = {
            46: 'del',
            67: 'copy',
            88: 'cut',
            86: 'paste'
        };

        // 显示glyf
        function showGLYF(ttf) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = unitsPerEm + ttf.hhea.descent;
            var glyfStr = '', d = '';
            ttf.glyf.forEach(function(glyf, index) {
                var g = {
                    index: index,
                    compound: glyf.compound ? 'compound' : '',
                    modify: glyf.modify,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    unicode: (glyf.unicode || []).map(function(u) {
                        return '$' + u.toString(16).toUpperCase();
                    }).join(','),
                    name: glyf.name
                };

                if (d = glyf2svg(glyf, ttf)) {
                    g.d = 'd="'+ d +'"';
                }

                glyfStr += string.format(GLYF_ITEM_TPL, g);
            });

            this.main.html(glyfStr);
        }


        // 点击item
        function clickItem(e) {
            $(this).toggleClass('selected');
        }

        // 点击item
        function clickAction(e) {
            e.stopPropagation();
            var target = $(e.target);
            var action = target.attr('data-action');

            if (action == 'del' && !window.confirm('确定删除字形么？')) {
                return;
            }

            var selected = [+target.parent().attr('data-index')];
            this.fire(action, {
                list: selected
            });
        }


        // 选择范围内元素
        function selectRangeItem(bound, toggle, append) {

            if (!toggle && !append) {
                this.main.children().removeClass('selected');
            }

            this.main.children().each(function(i, element) {
                var item = $(element);
                var pos = item.offset();
                var p = {
                    x: pos.left + item.width() / 2,
                    y: pos.top + item.height() / 2
                }

                if (p.x >= bound.x && p.x <= bound.x + bound.width 
                    && p.y >= bound.y && p.y <= bound.y + bound.height
                ) {
                    if (toggle) {
                        item.toggleClass('selected');
                    }
                    else {
                        item.addClass('selected')
                    }
                }
            });
        }

        // 按下事件
        function downlistener(e) {
            var me = this;

            // 保存
            if (83 === e.keyCode && e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
                me.fire('save');
            }
            // 处理其他事件，需要focus
            else {
                if (me.listening) {
                    // 阻止ctrl+A默认事件
                     if (65 === e.keyCode && e.ctrlKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        me.main.children().addClass('selected');
                    }
                    // 撤销
                    else if(e.keyCode == 90 && e.ctrlKey) {
                        e.stopPropagation();
                         me.fire('undo');
                    }
                    // 重做
                    else if(e.keyCode == 89 && e.ctrlKey) {
                        e.stopPropagation();
                        me.fire('redo');
                    }
                    // 取消选中
                    else if (27 === e.keyCode) {
                        e.stopPropagation();
                        me.main.children().removeClass('selected');
                    }
                    // 其他操作
                    else if (keyMap[e.keyCode] && (e.keyCode == 46 || e.ctrlKey)) {
                        e.stopPropagation();
                        var selected = me.getSelected();
                        if (e.keyCode == 86 || selected.length) {
                            me.fire(keyMap[e.keyCode], {
                                list: selected
                            });
                        }
                    }
                }
            }
        }

        /**
         * glyf查看器
         * 
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         */
        function GlyfViewer(main, options) {
            this.options = options || {};
            this.main = $(main);

            this.main.delegate('[data-index]', 'click', clickItem)
                .delegate('[data-action]', 'click', lang.bind(clickAction, this));


            var me = this;
            me.downlistener = lang.bind(downlistener, this);

            document.body.addEventListener('keydown', this.downlistener);

            $(document.body).on('click', function(e) {
                var focused = me.main.get(0) === e.target || me.main.get(0).contains(e.target);
                me.listening = focused;
            });

            me.capture = new MouseCapture(me.main.get(0), {
                events: {
                    dblclick: false,
                    mousewheel: false,
                    mouseover: false,
                    mouseout: false
                }
            });

            me.capture.on('dragstart', function(e) {
                $('#selection-range').show();
                me.main.addClass('no-hover');
                me.startX = e.originEvent.pageX;
                me.startY = e.originEvent.pageY;
            });

            var dragging = function(e) {
                var x = e.originEvent.pageX;
                var y = e.originEvent.pageY;
                $('#selection-range').css({
                    left: Math.min(me.startX, x),
                    top: Math.min(me.startY, y),
                    width: Math.abs(me.startX - x),
                    height: Math.abs(me.startY - y)
                });
            };
            me.capture.on('drag', dragging);

            me.capture.on('dragend', function(e) {
                $('#selection-range').hide();
                me.main.removeClass('no-hover');

                var x = e.originEvent.pageX;
                var y = e.originEvent.pageY;
                var pos = me.main.offset();

                selectRangeItem.call(me, {
                    x: Math.min(me.startX, x),
                    y:  Math.min(me.startY, y),
                    width: Math.abs(me.startX - x),
                    height: Math.abs(me.startY - y)
                }, e.ctrlKey, e.shiftKey);
            });

        }

        GlyfViewer.prototype.focus = function() {
            this.listening = true;
        };

        GlyfViewer.prototype.blur = function() {
            this.listening = false;
        };

        GlyfViewer.prototype.show = function(ttf) {
            showGLYF.call(this, ttf);
        };

        GlyfViewer.prototype.getSelected = function() {
            var selected = [];
            this.main.find('.selected').each(function(index, item) {
                selected.push(+item.getAttribute('data-index'));
            });
            return selected;
        };

        require('common/observable').mixin(GlyfViewer.prototype);

        return GlyfViewer;
    }
);
