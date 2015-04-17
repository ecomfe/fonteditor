/**
 * @file GLYFViewer.js
 * @author mengke01
 * @date
 * @description
 * glyf 查看器
 */

define(
    function (require) {

        var lang = require('common/lang');


        var viewerBinder = require('./binder');
        var viewerRender = require('./render');


        function showGLYF(ttf) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = unitsPerEm + ttf.hhea.descent;
            var selectedHash = {};
            var selectedList = this.selectedList || [];
            selectedList.forEach(function (i) {
                selectedHash[i] = true;
            });

            var glyfStr = '';
            var color = this.options.color;
            var editing = this.getEditing();
            var startIndex = this.page * this.options.pageSize;
            var endIndex = startIndex + this.options.pageSize;
            var glyfList = ttf.glyf.slice(startIndex, endIndex);
            var getGlyfHTML = viewerRender.render;

            glyfList.forEach(function (glyf, i) {
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


        function refreshGLYF(ttf, refreshList) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = unitsPerEm + ttf.hhea.descent;
            var selectedHash = {};
            var selectedList = this.selectedList || [];

            selectedList.forEach(function (i) {
                selectedHash[i] = true;
            });

            var main = this.main;
            var color = this.options.color;
            var editing = this.getEditing();
            var getGlyfHTML = viewerRender.render;

            main.hide();
            refreshList.forEach(function (index) {
                var glyfStr = getGlyfHTML(ttf.glyf[index], ttf, {
                    index: index,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    selected: selectedHash[index],
                    editing: editing === index,
                    color: color
                });

                var before = main.find('[data-index="' + index + '"]');
                if (before.length) {
                    $(glyfStr).insertBefore(before);
                    before.remove();
                }
            });
            main.show();
        }



        /**
         * glyf查看器
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         * @param {string} options.color 字形颜色
         * @param {string} options.shapeSize 字形大小
         * @param {number} options.pageSize 分页大小，如果字形个数超过100
         * @param {CommandMenu} options.commandMenu 菜单项
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

            viewerBinder.call(this);
        }

        /**
         * 获取焦点
         */
        GLYFViewer.prototype.focus = function () {
            if (!this.listening) {
                this.listening = true;
                document.body.addEventListener('keydown', this.downlistener);
            }
        };

        /**
         * 失去焦点
         */
        GLYFViewer.prototype.blur = function () {
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
        GLYFViewer.prototype.setPage = function (page) {
            this.page = page || 0;
        };

        /**
         * 获取分页
         *
         * @return {number}
         */
        GLYFViewer.prototype.getPage = function () {
            return this.page;
        };

        /**
         * 显示ttf文档
         *
         * @param {Object} ttf ttfObject
         * @param {Array=} selectedList 选中的列表
         *
         */
        GLYFViewer.prototype.show = function (ttf, selectedList) {
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
         * @param {Array=} indexList 需要刷新的列表
         */
        GLYFViewer.prototype.refresh = function (ttf, indexList) {
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
         * @param {Array=} selectedList 选中的列表
         */
        GLYFViewer.prototype.setSelected = function (selectedList) {
            this.selectedList = selectedList || [];
        };

        /**
         * 获取选中的列表
         *
         * @return {Array} 选中的indexList
         */
        GLYFViewer.prototype.getSelected = function () {
            return this.selectedList;
        };

        /**
         * 清除选中列表
         */
        GLYFViewer.prototype.clearSelected = function () {
            this.main.children().removeClass('selected');
            this.selectedList = [];
        };

        /**
         * 获取正在编辑的元素索引
         *
         * @return {number} 索引号
         */
        GLYFViewer.prototype.getEditing = function () {
            return this.editingIndex >= 0 ? this.editingIndex : -1;
        };

        /**
         * 设置正在编辑的元素
         *
         * @param {number} editingIndex 设置对象
         */
        GLYFViewer.prototype.setEditing = function (editingIndex) {
            this.clearEditing();
            editingIndex = +editingIndex;
            this.editingIndex = editingIndex >= 0 ? editingIndex : -1;
            if (editingIndex !== -1) {
                this.main.find('[data-index="' + editingIndex + '"]').addClass('editing');
            }
        };

        /**
         * 清除正在编辑的元素
         */
        GLYFViewer.prototype.clearEditing = function () {
            this.main.find('.editing').removeClass('editing');
            this.editingIndex = -1;
        };

        /**
         * 改变设置项目
         * @param {Object} options 设置对象
         */
        GLYFViewer.prototype.setSetting = function (options) {

            var oldOptions = this.options;
            if (options.shapeSize !== oldOptions.shapeSize) {
                this.main.removeClass(oldOptions.shapeSize);
                this.main.addClass(options.shapeSize);
            }

            var needRefresh = false;
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
         * @return {Object}
         */
        GLYFViewer.prototype.getSetting = function () {
            return this.options;
        };

        /**
         * 设置编辑模式
         *
         * @param {string} mode 编辑模式 list, edit
         */
        GLYFViewer.prototype.setMode = function (mode) {
            this.mode = mode || 'list';
            if (this.commandMenu) {
                this.commandMenu[this.mode === 'list' ? 'show' : 'hide']();
            }
        };

        require('common/observable').mixin(GLYFViewer.prototype);

        return GLYFViewer;
    }
);
