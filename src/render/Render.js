/**
 * @file 渲染器对象
 * @author mengke01(kekee000@gmail.com)
 */

import guid from './util/guid';
import Painter from './Painter';
import MouseCapture from './capture/Mouse';
import KeyboardCapture from './capture/Keyboard';
import ResizeCapture from './capture/Resize';
import observable from 'common/observable';


export default class Render {

    /**
     * Render 构造函数
     *
     * @param {HTMLElement} main 主元素
     * @param {Object} options 参数选项
     * @param {number} options.defaultRatio 默认的缩放比例
     * @param {number} options.minScale 最小缩放
     * @param {number} options.maxScale 最大缩放
     * @param {boolean} options.enableScale 是否允许缩放
     * @param {boolean} options.enableResize 是否允许大小改变
     * @constructor
     */
    constructor(main, options) {

        this.main = main;

        this.options = Object.assign(
            {
                defaultRatio: 1.2, // 默认的缩放比例
                minScale: 0.2, // 最小缩放
                maxScale: 200, // 最大缩放
                enableScale: true, // 是否允许缩放
                enableResize: true // 是否允许大小改变
            },
            options
        );

        this.id = guid();

        if (!this.main) {
            throw 'require a main dom element';
        }

        this.init();
    }

    /**
     * Render初始化
     */
    init() {

        // 注册画布
        this.painter = new Painter(
            this.main,
            this.options.painter
        );

        // 注册鼠标
        this.capture = new MouseCapture(
            this.main,
            this.options.mouse
        );

        // 注册键盘
        this.keyCapture = new KeyboardCapture(
            this.main,
            this.options.keyboard
        );

        this.camera = this.painter.camera;

        let me = this;

        // 是否允许缩放
        if (this.options.enableScale) {
            this.capture.on('wheel', function (e) {
                if (e.altKey || e.ctrlKey) {

                    let defaultRatio = me.options.defaultRatio || 1.2;
                    let ratio = e.delta > 0 ? defaultRatio : 1 / defaultRatio;
                    let toScale = me.camera.scale * ratio;
                    if (
                        toScale < me.options.minScale
                        || toScale > me.options.maxScale
                    ) {
                        return;
                    }

                    me.scale(ratio, e);
                }
                else {
                    let moval = e.delta > 0 ? 30 : -30;
                    me.move(e.shiftKey ? moval : 0, e.shiftKey ? 0 : moval);
                    me.refresh();
                }
            });
        }

        // 窗口改变
        if (this.options.enableResize) {
            this.resizeCapture = new ResizeCapture(this.main);
            this.resizeCapture.on('resize', function (e) {
                // 对象被隐藏，不做处理，仅作标记，refresh之后再处理
                if (me.main.style.display === 'none') {
                    me.hasResized = true;
                    return;
                }

                let prevSize = me.painter.getSize();
                me.painter.resetSize();
                let size = me.painter.getSize();

                me.fire('resize', {
                    size,
                    prevSize
                });
            });
        }
    }

    /**
     * 设置鼠标样式
     *
     * @param {string} name 名字
     * @return {this}
     */
    setCursor(name) {
        this.main.style.cursor = name || 'default';
        return this;
    }

    /**
     * 刷新render
     *
     * @return {this}
     */
    refresh() {
        if (this.hasResized) {
            this.painter.resetSize();
            this.hasResized = false;
        }
        this.painter.refresh();
        return this;
    }

    /**
     * 重置渲染器
     */
    reset() {
        this.painter.reset();
    }

    /**
     * 缩放指定的比例
     *
     * @param {number} ratio 比例
     * @param {Object} p 参考点坐标
     * @param {boolean} noRefresh 无刷新缩放
     */
    scale(ratio, p, noRefresh) {

        let toScale = this.camera.scale * ratio;
        if (
            toScale < this.options.minScale
            || toScale > this.options.maxScale
        ) {
            return;
        }

        this.camera.ratio = ratio;
        this.camera.center.x = p.x;
        this.camera.center.y = p.y;
        this.camera.scale = toScale;

        if (true !== noRefresh) {
            this.painter.refresh();
        }
        else {
            this.painter.adjust();
        }

        this.camera.ratio = 1;
    }

    /**
     * 缩放到指定的比例
     *
     * @param {number} scale 比例
     * @param {Object} p 中心点坐标
     * @param {boolean} noRefresh 无刷新缩放
     */
    scaleTo(scale, p, noRefresh) {

        // 缩放
        this.scale(scale / this.camera.scale, this.camera.center, true);

        // 平移
        this.painter.moveTo(p.x, p.y);
        this.camera.reset(p, scale);

        if (true !== noRefresh) {
            this.painter.refresh();
        }
    }

    /**
     * 获取焦点
     */
    focus() {
        // this.capture.start();
        this.keyCapture.start();
    }

    /**
     * 离开焦点
     */
    blur() {
        // this.capture.stop();
        this.keyCapture.stop();
    }

    /**
     * 注销对象
     */
    dispose() {

        this.un();

        this.painter.dispose();
        this.capture.dispose();
        this.keyCapture.dispose();
        this.resizeCapture && this.resizeCapture.dispose();

        this.main = this.options = this.camera = null;
        this.painter = this.capture = this.keyCapture = null;
    }
}

// 注册painter中的函数
[
    'addSupport', 'move', 'getSize',
    'getLayer', 'addLayer', 'removeLayer',
    'getShapeIn', 'clearShapes'
].forEach(function (fnName) {
    Render.prototype[fnName] = function (...args) {
        return this.painter[fnName].apply(this.painter, args);
    };
});

observable.mixin(Render.prototype);
