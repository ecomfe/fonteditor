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
            + '<div data-index="${index}" class="glyf-item ${compound} ${modify} ${selected} ${editing}">'
            +   '<i data-action="edit" class="ico i-edit" title="编辑"></i>'
            +   '<i data-action="del" class="ico i-del" title="删除"></i>'
            +   '<svg class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}">'
            +       '<g transform="scale(1, -1) translate(0, -${descent}) scale(0.95, 0.95) ">'
            +           '<path class="path" ${fillColor} ${d}/></g>'
            +   '</svg>'
            +   '<div data-field="unicode" class="unicode" title="${unicode}">${unicode}</div>'
            +   '<div data-field="name" class="name" title="${name}">${name}</div>'
            + '</div>';

        // 获取glyfhtml文本
        function getGlyfHTML(glyf, ttf, opt) {
            var g = {
                index: opt.index,
                compound: glyf.compound ? 'compound' : '',
                selected: opt.selected ? 'selected' : '',
                editing: opt.editing ? 'editing' : '',
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
        function showGLYF(ttf) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = unitsPerEm + ttf.hhea.descent;
            var selectedHash = {};
            var selectedList = this.selectedList || [];
            selectedList.forEach(function(i) {
                selectedHash[i] = true;
            });

            var glyfStr = '';
            var color = this.options.color;
            var editing = this.getEditing();
            var startIndex = this.page * this.options.pageSize;
            var endIndex = startIndex + this.options.pageSize;
            var glyfsegment = ttf.glyf.slice(startIndex, endIndex);

            glyfsegment.forEach(function(glyf, i) {
                var index = startIndex + i;
                glyfStr += getGlyfHTML(glyf, ttf, {
                    index: index,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    selected: selectedHash[index],
                    editing: editing === index,
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
            var selectedList = this.selectedList || [];

            selectedList.forEach(function(i) {
                selectedHash[i] = true;
            });

            var main = this.main;
            var color = this.options.color;
            var editing = this.getEditing();

            indexList.forEach(function (index) {
                var glyfStr = getGlyfHTML(ttf.glyf[index], ttf, {
                    index: index,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    selected: selectedHash[index],
                    editing: editing === index,
                    color: color
                });
                var before = main.find('[data-index="'+ index +'"]');
                if (before.length) {
                    $(glyfStr).insertBefore(before);
                    before.remove();
                }
            });
        }

        // 点击item
        function clickAction(e) {
            e.stopPropagation();
            var target = $(e.target);
            var action = target.attr('data-action');
            var editing = this.getEditing();
            var selectedGlyf = target.parent('[data-index]');
            var selected = +selectedGlyf.attr('data-index');

            if (action == 'del') {
                if (!window.confirm('确定删除字形么？')) {
                    return;
                }
                else {
                    // 被选中的情况下需要移出
                    selectedGlyf.remove();
                    var selectedIndex = this.selectedList.indexOf(selected);
                    if (selectedIndex >= 0) {
                        this.selectedList.splice(selectedIndex, 1);
                    }
                }
            }
            else if (action == 'edit') {
                this.clearEditing();
                this.setEditing(selected);
                selectedGlyf.addClass('editing');
            }

            this.fire(action, {
                list: [selected]
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
                else if(90 === e.keyCode && e.ctrlKey) {
                    e.stopPropagation();
                     me.fire('undo');
                }
                // 重做
                else if(89 === e.keyCode && e.ctrlKey) {
                    e.stopPropagation();
                    me.fire('redo');
                }
                // 取消选中
                else if (27 === e.keyCode) {
                    e.stopPropagation();
                    me.clearSelected();
                    me.clearEditing();
                    me.fire('selection:change');
                }
                // del, cut
                else if (46 === e.keyCode || (88 === e.keyCode && e.ctrlKey)) {
                    e.stopPropagation();
                    var selected = me.getSelected();
                    if (selected.length) {
                        // del, cut 取消选中的glyf
                        me.clearSelected();
                        // 正在编辑的
                        var editing = selected.indexOf(me.getEditing());
                        if (editing >= 0) {
                            me.clearEditing();
                        }

                        me.fire('selection:change');
                        me.fire(46 === e.keyCode ? 'del' : 'cut', {
                            list: selected
                        });
                    }
                }
                // copy
                else if (67 === e.keyCode && e.ctrlKey) {
                    var selected = me.getSelected();
                    if (selected.length) {
                        me.fire('copy', {
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
            .on('click', '[data-index]', function() {
                $(this).toggleClass('selected');
                me.fire('selection:change');
            })
            .on('click', '[data-action]', lang.bind(clickAction, this));

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
         * 获取选中的glyfIndex
         *
         * @return {Array} 选中的glyf列表
         */
        function getSelectedGlyf() {
            var selected = [];
            this.main.find('.selected').each(function(index, item) {
                selected.push(+item.getAttribute('data-index'));
            });
            return selected;
        }

        /**
         * 绑定命令菜单
         */
        function bindCommandMenu() {
            var commandMenu = this.commandMenu;

            var me = this;
            me.on('selection:change', lang.debounce(function() {
                var selected = getSelectedGlyf.call(me);
                me.selectedList = selected;

                if (selected.length) {
                    commandMenu.enableCommands(['copy', 'cut', 'del']);
                    commandMenu[selected.length === 1 ? 'enableCommands' : 'disableCommands'](['setting-font']);
                }
                else {
                    commandMenu.disableCommands(['copy', 'cut', 'del', 'setting-font']);
                }

            }, 100));

            var delayFocus = lang.debounce(function() {
                me.focus();
            }, 20);

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
                delayFocus();
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

            this.options = lang.extend({
                color: '', // 字形颜色
                shapeSize: 'normal', // 字形大小
                pageSize: 100 // 分页大小，如果字形个数超过100 则自动分页
            }, options);

            this.main = $(main);
            this.mode = 'list';
            this.page = 0;
            this.selectedList = [];

            bindEvents.call(this);

            if (this.options.commandMenu) {
                this.commandMenu = this.options.commandMenu;
                delete this.options.commandMenu;
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
         * 设置分页
         *
         * @param {number} page 页码
         */
        GLYFViewer.prototype.setPage = function(page) {
            this.page = page || 0;
        };

        /**
         * 获取分页
         *
         * @param {number} page 页码
         */
        GLYFViewer.prototype.getPage = function() {
            return this.page;
        };

        /**
         * 显示ttf文档
         *
         * @param {Object} ttf ttfObject
         * @param {Array?} selectedList 选中的列表
         *
         */
        GLYFViewer.prototype.show = function(ttf, selectedList) {
            if (selectedList) {
                this.setSelected(selectedList);
            }
            showGLYF.call(this, ttf);
            this.fire('selection:change');
        };

        /**
         * 刷新ttf文档
         *
         * @param {Object} ttf ttfObject
         * @param {Array?} indexList 需要刷新的列表
         */
        GLYFViewer.prototype.refresh = function(ttf, indexList) {
            if (!indexList || indexList.length === 0) {
                showGLYF.call(this, ttf);
            }
            else {
                refreshGLYF.call(this, ttf, indexList);
            }
        };

        /**
         * 设置选中的列表
         *
         * @param {Array?} selectedList 选中的列表
         */
        GLYFViewer.prototype.setSelected = function(selectedList) {
            this.selectedList = selectedList || [];
        };

        /**
         * 获取选中的列表
         *
         * @return {Array} 选中的indexList
         */
        GLYFViewer.prototype.getSelected = function() {
            return this.selectedList;
        };

        /**
         * 清除选中列表
         */
        GLYFViewer.prototype.clearSelected = function() {
            this.main.children().removeClass('selected');
            this.selectedList = [];
        };

        /**
         * 获取正在编辑的元素索引
         *
         * @return {number} 索引号
         */
        GLYFViewer.prototype.getEditing = function() {
            return this.editingIndex >= 0 ? this.editingIndex : -1;
        };

        /**
         * 设置正在编辑的元素
         * @param {number} editingIndex 设置对象
         */
        GLYFViewer.prototype.setEditing = function(editingIndex) {
            this.editingIndex = editingIndex >= 0 ? editingIndex : -1;
        };

        /**
         * 清除正在编辑的元素
         */
        GLYFViewer.prototype.clearEditing = function() {
            this.main.find('.editing').removeClass('editing');
            this.editingIndex = -1;
        };

        /**
         * 改变设置项目
         * @param {Object} options 设置对象
         */
        GLYFViewer.prototype.setSetting = function(options) {

            var oldOptions = this.options;
            if (options.shapeSize !== oldOptions.shapeSize) {
                this.main.removeClass(oldOptions.shapeSize);
                this.main.addClass(options.shapeSize);
            }

            var needRefresh = false
            if (options.color !== oldOptions.color) {
                needRefresh = true;
            }

            if (options.pageSize !== oldOptions.pageSize) {
                needRefresh = true;
            }

            this.options = lang.overwrite(oldOptions, options);

            if (needRefresh) {
                this.fire('refresh');
            }
        };

        /**
         * 获取设置项目
         */
        GLYFViewer.prototype.getSetting = function() {
            return this.options;
        };

        /**
         * 设置编辑模式
         * @param {string} mode 编辑模式
         */
        GLYFViewer.prototype.setMode = function(mode) {
            this.mode = mode || 'list';
            if (this.commandMenu) {
                this.commandMenu[this.mode === 'list' ? 'show' : 'hide']();
            }
        };

        require('common/observable').mixin(GLYFViewer.prototype);

        return GLYFViewer;
    }
);
