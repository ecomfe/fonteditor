/**
 * @file 字体编辑控制器
 * @author mengke01(kekee000@gmail.com)
 */

import observable from 'common/observable';
import modeSupport from './mode/support';
import ContextMenu from './widget/ContextMenu';
import commandSupport from './command/support';
import clipboard from './widget/clipboard';
import History from './widget/History';
import Sorption from './widget/Sorption';
import getFontHash from './util/getFontHash';
import defaultIniters from './controller/index';

export default class Editor {

    /**
     * Render控制器
     *
     * @param {HTMLElement} main 主元素
     * @param {Object} options 参数
     * @constructor
     */
    constructor(main, options) {
        this.options = options || {};
        this.contextMenu = new ContextMenu(main, this.options.contextMenu);
        this.sorption = new Sorption(this.options.sorption);
        this.history = new History();
        this.initers = defaultIniters.concat(options.initers || []);
    }

    /**
     * 设置渲染器
     *
     * @param {Render} render 渲染器对象
     * @return {this}
     */
    setRender(render) {
        this.render = render;

        // 按顺序执行editor的控制器
        for (let i = 0, l = this.initers.length; i < l; i++) {
            this.initers[i].call(this);
        }

        this.axisLayer.refresh();
        this.graduationLayer.refresh();
        this.setMode();
        return this;
    }

    /**
     * 切换编辑模式
     *
     * @param {string} modeName 模式名称
     * @param {...Array} args args
     * @return {this}
     */
    setMode(modeName, ...args) {
        if (this.mode) {
            this.mode.end && this.mode.end.call(this);
        }
        this.mode = modeSupport[modeName] || modeSupport.default;
        this.mode.begin && this.mode.begin.apply(this, args);
        return this;
    }

    /**
     * 重置编辑器组件
     *
     * @return {this}
     */
    reset() {
        this.fontLayer.clearShapes();
        this.coverLayer.clearShapes();
        this.font = null;
        this.refresh();
        return this;
    }

    /**
     * 刷新编辑器组件
     *
     * @return {this}
     */
    refresh() {
        this.render.refresh();
        return this;
    }

    /**
     * 设置选中的shapes
     *
     * @param {Array} shapes 选中的shapes
     */
    setSelected(shapes) {
        this.setMode('shapes', shapes);
    }

    /**
     * 刷新选中的shapes
     *
     * @param {Array} shapes 选中的shapes
     */
    refreshSelected(shapes) {
        if (this.currentGroup) {
            let lastShapes = this.currentGroup.shapes;
            this.currentGroup.setShapes(shapes);
            this.currentGroup.refresh();

            if (shapes !== lastShapes) {
                this.fire('selection:change', {
                    shapes
                });
            }
        }
    }

    /**
     * 获取选中的shapes
     *
     * @return {Array} 选中的shapes
     */
    getSelected() {
        return this.currentGroup ? this.currentGroup.shapes : null;
    }

    /**
     * 执行指定命令
     *
     * @param {...string} command 指令名，后续为命令参数集合
     * @param {...Array} args args
     * @return {boolean} 是否执行成功
     */
    execCommand(command, ...args) {
        let event = {
            command,
            args
        };
        this.fire('beforecommand', event);

        if (event.returnValue === false) {
            return false;
        }

        if (commandSupport[command]) {
            let ret = commandSupport[command].apply(this, args);
            event.result = ret;
            this.fire('command', event);
            return ret;
        }

        return false;
    }

    /**
     * 是否支持指令
     *
     * @param {string} command 指令名
     * @return {boolean} 是否
     */
    supportCommand(command) {
        return !!commandSupport[command];
    }

    /**
     * 添加指令
     *
     * @param {string} command 指令名
     * @param {Function} worker 执行函数
     * @return {boolean} 是否成功
     */
    addCommand(command, worker) {
        if (commandSupport[command]) {
            return false;
        }
        commandSupport[command] = worker;
        return true;
    }

    /**
     * 是否改变过
     *
     * @return {boolean}
     */
    isChanged() {
        let font = this.getFont();
        return this.fontHash !== getFontHash(font);
    }

    /**
     * 重置改变状态
     *
     * @param {boolean} changed 状态
     */
    setChanged(changed) {
        if (changed) {
            this.fontHash = 0;
        }
        else {
            let font = this.getFont();
            this.fontHash = getFontHash(font);
        }
    }

    /**
     * 添加到剪切板
     *
     * @param {Array} shapes 形状集合
     * @return {this}
     */
    setClipBoard(shapes) {
        clipboard.set(shapes, 'editor-shape');
        return this;
    }

    /**
     * 从剪切板中获取
     *
     * @return {this}
     */
    getClipBoard() {
        return clipboard.get('editor-shape');
    }

    /**
     * 获取焦点
     *
     */
    focus() {
        this.render.focus();
    }

    /**
     * 离开焦点
     *
     */
    blur() {
        this.render.blur();
    }

    /**
     * 注销
     */
    dispose() {
        this.un();
        this.contextMenu.dispose();
        this.render && this.render.dispose();
        this.graduationMarker.dispose();

        this.options = this.contextMenu = this.render = null;
        this.fontLayer = this.coverLayer = this.axisLayer
            = this.referenceLineLayer = this.graduationLayer = null;
        this.axis = this.rightSideBearing = this.graduation
            = this.graduationMarker = this.font = null;

        this.sorption.dispose();
        this.sorption = null;

        this.history.reset();
        this.history = null;

        this.mode = null;
    }
}

observable.mixin(Editor.prototype);
