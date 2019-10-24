/**
 * @file 字形查看器
 * @author mengke01(kekee000@gmail.com)
 */

import observable from 'common/observable';
import lang from 'common/lang';
import viewerBinder from './binder';
import viewerRender from './render';


function showGLYF(ttf) {
    let unitsPerEm = ttf.head.unitsPerEm;
    let descent = ttf.hhea.descent;
    let selectedHash = {};
    let selectedList = this.selectedList || [];
    selectedList.forEach(function (i) {
        selectedHash[i] = true;
    });

    let glyfStr = '';
    let color = this.options.color;
    let editing = this.getEditing();
    let startIndex = this.page * this.options.pageSize;
    let endIndex = startIndex + this.options.pageSize;
    let glyfList = ttf.glyf.slice(startIndex, endIndex);
    let getGlyfHTML = viewerRender.render;

    glyfList.forEach(function (glyf, i) {
        let index = startIndex + i;
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
    let unitsPerEm = ttf.head.unitsPerEm;
    let descent = ttf.hhea.descent;
    let selectedHash = {};
    let selectedList = this.selectedList || [];

    selectedList.forEach(function (i) {
        selectedHash[i] = true;
    });

    let main = this.main;
    let color = this.options.color;
    let editing = this.getEditing();
    let getGlyfHTML = viewerRender.render;

    main.hide();
    refreshList.forEach(function (index) {
        let glyfStr = getGlyfHTML(ttf.glyf[index], ttf, {
            index: index,
            unitsPerEm: unitsPerEm,
            descent: descent,
            selected: selectedHash[index],
            editing: editing === index,
            color: color
        });

        let before = main.find('[data-index="' + index + '"]');
        if (before.length) {
            $(glyfStr).insertBefore(before);
            before.remove();
        }
    });
    main.show();
}

export default class GLYFViewer {

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
    constructor(main, options) {

        this.options = Object.assign({
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
    focus() {
        if (!this.listening) {
            this.listening = true;
            document.body.addEventListener('keydown', this.downlistener);
        }
    }

    /**
     * 失去焦点
     */
    blur() {
        if (this.listening) {
            this.listening = false;
            document.body.removeEventListener('keydown', this.downlistener);
        }
    }

    /**
     * 设置分页
     *
     * @param {number} page 页码
     */
    setPage(page) {
        this.page = page || 0;
    }

    /**
     * 获取分页
     *
     * @return {number}
     */
    getPage() {
        return this.page;
    }

    /**
     * 显示ttf文档
     *
     * @param {Object} ttf ttfObject
     * @param {Array=} selectedList 选中的列表
     *
     */
    show(ttf, selectedList) {
        if (selectedList) {
            this.setSelected(selectedList);
        }
        showGLYF.call(this, ttf);
        this.fire('selection:change');
    }

    /**
     * 刷新ttf文档
     *
     * @param {Object} ttf ttfObject
     * @param {Array=} indexList 需要刷新的列表
     */
    refresh(ttf, indexList) {
        if (!indexList || indexList.length === 0) {
            showGLYF.call(this, ttf);
        }
        else {
            refreshGLYF.call(this, ttf, indexList);
        }
    }

    /**
     * 设置选中的列表
     *
     * @param {Array=} selectedList 选中的列表
     */
    setSelected(selectedList) {
        this.selectedList = selectedList || [];
    }

    /**
     * 获取选中的列表
     *
     * @return {Array} 选中的indexList
     */
    getSelected() {
        return this.selectedList;
    }

    /**
     * 清除选中列表
     */
    clearSelected() {
        this.main.children().removeClass('selected');
        this.selectedList = [];
    }

    /**
     * 获取正在编辑的元素索引
     *
     * @return {number} 索引号
     */
    getEditing() {
        return this.editingIndex >= 0 ? this.editingIndex : -1;
    }

    /**
     * 设置正在编辑的元素
     *
     * @param {number} editingIndex 设置对象
     */
    setEditing(editingIndex) {
        this.clearEditing();
        editingIndex = +editingIndex;
        this.editingIndex = editingIndex >= 0 ? editingIndex : -1;
        if (editingIndex !== -1) {
            this.main.find('[data-index="' + editingIndex + '"]').addClass('editing');
        }
    }

    /**
     * 清除正在编辑的元素
     */
    clearEditing() {
        this.main.find('.editing').removeClass('editing');
        this.editingIndex = -1;
    }

    /**
     * 改变设置项目
     *
     * @param {Object} options 设置对象
     */
    setSetting(options) {

        let oldOptions = this.options;
        if (options.shapeSize !== oldOptions.shapeSize) {
            this.main.removeClass(oldOptions.shapeSize);
            this.main.addClass(options.shapeSize);
        }

        let needRefresh = false;
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
    }

    /**
     * 获取设置项目
     *
     * @return {Object}
     */
    getSetting() {
        return this.options;
    }

    /**
     * 设置编辑模式
     *
     * @param {string} mode 编辑模式 list, edit
     */
    setMode(mode) {
        this.mode = mode || 'list';
        if (this.commandMenu) {
            this.commandMenu[this.mode === 'list' ? 'show' : 'hide']();
        }
    }
}

observable.mixin(GLYFViewer.prototype);
