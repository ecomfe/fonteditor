/**
 * @file GLYFViewer.js
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
            + '<div data-index="${index}" class="glyf-item ${compound} ${modify} ${selected}">'
            +   '<i data-action="edit" class="ico i-edit" title="编辑"></i>'
            +   '<i data-action="del" class="ico i-del" title="删除"></i>'
            +   '<svg class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}">'
            +       '<g transform="scale(1, -1) translate(0, -${descent}) scale(0.95, 0.95) ">'
            +           '<path class="path" ${fillColor} ${d}/></g>'
            +   '</svg>'
            +   '<div data-field="unicode" class="unicode" title="${unicode}">${unicode}</div>'
            +   '<div data-field="name" class="name" title="${name}">${name}</div>'
            + '</div>';

        var keyMap = {
            46: 'del',
            67: 'copy',
            88: 'cut'
        };

        // 获取glyfhtml文本
        function getGlyfHTML(glyf, ttf, opt) {
            var g = {
                index: opt.index,
                compound: glyf.compound ? 'compound' : '',
                selected: opt.selected ? 'selected' : '',
                modify: glyf.modify,
                unitsPerEm: opt.unitsPerEm,
                descent: opt.descent,
                unicode: (glyf.unicode || []).map(function(u) {
                    return '$' + u.toString(16).toUpperCase();
                }).join(','),
                name: glyf.name,
                fillColor: opt.color ? 'style="fill:'+ opt.color +'"' : ''
            };
            var d = '';
            if ((d = glyf2svg(glyf, ttf))) {
                g.d = 'd="'+ d +'"';
            }

            return string.format(GLYF_ITEM_TPL, g);
        }

        // 显示glyf
        function showGLYF(ttf, selectedList) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = unitsPerEm + ttf.hhea.descent;
            var selectedHash = {};
            (selectedList || []).forEach(function(i) {
                selectedHash[i] = true;
            });

            var glyfStr = '';
            var color = this.options.color;
            ttf.glyf.forEach(function(glyf, index) {
                glyfStr += getGlyfHTML(glyf, ttf, {
                    index: index,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    selected: selectedHash[index],
                    color: color
                });
            });

            this.main.html(glyfStr);
        }

        // 刷新glyf
        function refreshGLYF(ttf, indexList) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = unitsPerEm + ttf.hhea.descent;
            var selectedHash = {};
            var selectedList = this.getSelected();

            selectedList.forEach(function(i) {
                selectedHash[i] = true;
            });

            var main = this.main;
            var color = this.options.color;
            indexList.forEach(function (index) {
                var glyfStr = getGlyfHTML(ttf.glyf[index], ttf, {
                    index: index,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    selected: selectedHash[index],
                    color: color
                });
                var before = main.find('[data-index="'+ index +'"]');
                $(glyfStr).insertBefore(before);
                before.remove();
            });
        }

        // 点击item
        function clickAction(e) {
            e.stopPropagation();
            var target = $(e.target);
            var action = target.attr('data-action');

            if (action == 'del' && !window.confirm('确定删除字形么？')) {
                return;
            }

            var selected = [+target.parent('[data-index]').attr('data-index')];
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
                };

                if (p.x >= bound.x && p.x <= bound.x + bound.width 
                    && p.y >= bound.y && p.y <= bound.y + bound.height
                ) {
                    if (toggle) {
                        item.toggleClass('selected');
                    }
                    else {
                        item.addClass('selected');
                    }
                }
            });

            this.fire('selection:change');
        }

        // 按下事件
        function downlistener(e) {
            var me = this;
            e.ctrlKey = e.ctrlKey || e.metaKey;
            
            if (me.listening) {
                // 阻止ctrl+A默认事件
                 if (65 === e.keyCode && e.ctrlKey) {
                    me.main.children().addClass('selected');
                    me.fire('selection:change');
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
                    me.clearSelected();
                    me.fire('selection:change');
                }
                // 其他操作
                else if (keyMap[e.keyCode] && (e.keyCode == 46 || e.ctrlKey)) {
                    e.stopPropagation();
                    var selected = me.getSelected();

                    // 取消选中的glyf
                    if (e.keyCode == 46 || e.keyCode == 88) {
                        me.clearSelected();
                        me.fire('selection:change');
                    }

                    // 粘贴和有选择的操作需要发事件
                    if (selected.length) {
                        me.fire(keyMap[e.keyCode], {
                            list: selected
                        });
                    }
                }
            }
            
        }

        /**
         * 绑定dom事件
         */
        function bindEvents() {

            var me = this;
            me.main
            .delegate('[data-index]', 'click', function() {
                $(this).toggleClass('selected');
                me.fire('selection:change');
            })
            .delegate('[data-action]', 'click', lang.bind(clickAction, this));

            me.downlistener = lang.bind(downlistener, this);

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
                var width = Math.abs(me.startX - x);
                var height = Math.abs(me.startY - y);
                if (width < 20 && height < 20) {
                    return;
                }

                selectRangeItem.call(me, {
                    x: Math.min(me.startX, x),
                    y:  Math.min(me.startY, y),
                    width: width,
                    height: height 
                }, e.ctrlKey, e.shiftKey);
            });
        }

        /**
         * 绑定命令菜单
         */
        function bindCommandMenu() {
            var commandMenu = this.options.commandMenu;

            var me = this;
            me.on('selection:change', lang.debounce(function() {
                var selected = me.getSelected();
                if (selected.length) {
                    commandMenu.enableCommands(['copy', 'cut', 'del']);
                    commandMenu[selected.length === 1 ? 'enableCommands' : 'disableCommands'](['info']);
                }
                else {
                    commandMenu.disableCommands(['copy', 'cut', 'del', 'info']);  
                }

            }, 20));

            commandMenu.on('command', function(e) {
                var command = e.command;
                if (command === 'paste' || command === 'adjust-pos' || command === 'adjust-glyf') {
                    me.fire(command);
                }
                else {
                    var selected = me.getSelected();

                    // 取消选中的glyf
                    if (command === 'cut' || command === 'del') {  
                        me.clearSelected();
                    }

                    me.fire(command, {
                        list: selected
                    });
                }

                // 这里延时进行focus
                setTimeout(function() {
                    me.focus();
                }, 20);
            });
        }

        /**
         * glyf查看器
         * 
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         */
        function GLYFViewer(main, options) {
            this.options = options || {};
            this.main = $(main);
            this.mode = 'list';

            bindEvents.call(this);

            if (this.options.commandMenu) {
                bindCommandMenu.call(this);
            }
        }

        /**
         * 获取焦点
         */
        GLYFViewer.prototype.focus = function() {
            if (!this.listening) {
                this.listening = true;
                document.body.addEventListener('keydown', this.downlistener);
            }
        };

        /**
         * 失去焦点
         */
        GLYFViewer.prototype.blur = function() {
            if (this.listening) {
                this.listening = false;
                document.body.removeEventListener('keydown', this.downlistener);
            }
        };

        /**
         * 显示ttf文档
         * 
         * @param {Object} ttf ttfObject
         * @param {Array?} selectedList 选中的列表
         */
        GLYFViewer.prototype.show = function(ttf, selectedList) {
            showGLYF.call(this, ttf, selectedList);
            this.fire('selection:change');
        };

        /**
         * 刷新ttf文档
         * 
         * @param {Object} ttf ttfObject
         * @param {Array?} selectedList 选中的列表
         */
        GLYFViewer.prototype.refresh = function(ttf, indexList) {
            if (!indexList || indexList.length === 0) {
                showGLYF.call(this, ttf, indexList);
            }
            else {
                refreshGLYF.call(this, ttf, indexList);
            }
            this.fire('selection:change');
        };

        /**
         * 获取选中的列表
         * 
         * @return {Array} 选中的indexList
         */
        GLYFViewer.prototype.getSelected = function() {
            var selected = [];
            this.main.find('.selected').each(function(index, item) {
                selected.push(+item.getAttribute('data-index'));
            });
            return selected;
        };

        /**
         * 获取设置项目
         */
        GLYFViewer.prototype.setSetting = function(options) {
            var oldOptions = this.options;
            this.options = options; 
            if (options.color !== oldOptions.color) {
                this.main.find('path').css('fill', options.color);
            }
        };

        /**
         * 获取设置项目
         */
        GLYFViewer.prototype.getSetting = function() {
            return this.options;
        };

        /**
         * 清除选中列表
         */
        GLYFViewer.prototype.clearSelected = function() {
            this.main.children().removeClass('selected');
        };

        /**
         * 设置编辑模式
         * @param {string} mode 编辑模式
         */
        GLYFViewer.prototype.setMode = function(mode) {
            this.mode = mode || 'list';
            if (this.options.commandMenu) {
                this.options.commandMenu[this.mode === 'list' ? 'show' : 'hide']();
            }
        };

        /**
         * 设置选中的列表
         */
        GLYFViewer.prototype.setSelected = function(selectedList) {
            if (selectedList && 0 !== selectedList.length) {
                var selectedHash = {};

                selectedList.forEach(function(i) {
                    selectedHash[i] = true;
                });

                this.main.children().each(function(index, item) {
                    if (selectedHash[item.getAttribute('data-index')]) {
                        $(item).addClass('selected');
                    }
                });
            }
        };

        require('common/observable').mixin(GLYFViewer.prototype);

        return GLYFViewer;
    }
);
