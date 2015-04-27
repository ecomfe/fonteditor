/**
 * @file 字体编辑控制器
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var modeSupport = require('./mode/support');
        var ContextMenu = require('./widget/ContextMenu');
        var commandSupport = require('./command/support');
        var clipboard = require('./widget/clipboard');
        var History = require('./widget/History');
        var Sorption = require('./widget/Sorption');
        var getFontHash = require('./util/getFontHash');

        // editor 的控制器
        var initLayer = require('./controller/initLayer');
        var initRender = require('./controller/initRender');
        var initBinder = require('./controller/initBinder');
        var initAxis = require('./controller/initAxis');
        var initFont = require('./controller/initFont');
        var initSetting = require('./controller/initSetting');

        /**
         * Render控制器
         *
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         * @constructor
         */
        function Editor(main, options) {
            this.options = options || {};
            this.contextMenu = new ContextMenu(main, this.options.contextMenu);
            this.sorption = new Sorption(this.options.sorption);
            this.history = new History();
        }

        /**
         * 设置渲染器
         *
         * @param {Render} render 渲染器对象
         * @return {this}
         */
        Editor.prototype.setRender = function (render) {

            this.render = render;
            initSetting.call(this);
            initFont.call(this);
            initRender.call(this);
            initLayer.call(this);
            initAxis.call(this);
            initBinder.call(this);

            this.axisLayer.refresh();
            this.graduationLayer.refresh();

            this.setMode();

            return this;
        };

        /**
         * 切换编辑模式
         *
         * @param {string} modeName 模式名称
         * @return {this}
         */
        Editor.prototype.setMode = function (modeName) {

            if (this.mode) {
                this.mode.end && this.mode.end.call(this);
            }

            this.mode = modeSupport[modeName] || modeSupport.default;
            var args = Array.prototype.slice.call(arguments, 1);
            this.mode.begin && this.mode.begin.apply(this, args);
            return this;
        };

        /**
         * 重置编辑器组件
         *
         * @return {this}
         */
        Editor.prototype.reset = function () {
            this.fontLayer.clearShapes();
            this.coverLayer.clearShapes();
            this.font = null;
            this.refresh();
            return this;
        };

        /**
         * 刷新编辑器组件
         *
         * @return {this}
         */
        Editor.prototype.refresh = function () {
            this.render.refresh();
            return this;
        };

        /**
         * 设置选中的shapes
         *
         * @param {Array} shapes 选中的shapes
         */
        Editor.prototype.setSelected = function (shapes) {
            this.setMode('shapes', shapes);
        };

        /**
         * 刷新选中的shapes
         *
         * @param {Array} shapes 选中的shapes
         */
        Editor.prototype.refreshSelected = function (shapes) {
            if (this.currentGroup) {
                var lastShapes = this.currentGroup.shapes;
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();

                if (shapes !== lastShapes) {
                    this.fire('selection:change', {
                        shapes: shapes
                    });
                }
            }
        };

        /**
         * 获取选中的shapes
         *
         * @return {Array} 选中的shapes
         */
        Editor.prototype.getSelected = function () {
            return this.currentGroup ? this.currentGroup.shapes : null;
        };

        /**
         * 执行指定命令
         *
         * @param {...string} command 指令名，后续为命令参数集合
         * @return {boolean} 是否执行成功
         */
        Editor.prototype.execCommand = function (command) {

            var args = Array.prototype.slice.call(arguments, 1);
            var event = {
                command: command,
                args: args
            };
            this.fire('beforecommand', event);

            if (event.returnValue === false) {
                return false;
            }

            if (commandSupport[command]) {
                var ret = commandSupport[command].apply(this, args);
                event.result = ret;
                this.fire('command', event);
                return ret;
            }

            return false;
        };

        /**
         * 是否支持指令
         *
         * @param {string} command 指令名
         * @return {boolean} 是否
         */
        Editor.prototype.supportCommand = function (command) {
            return !!commandSupport[command];
        };

        /**
         * 添加指令
         *
         * @param {string} command 指令名
         * @param {Function} worker 执行函数
         * @return {boolean} 是否成功
         */
        Editor.prototype.addCommand = function (command, worker) {
            if (commandSupport[command]) {
                return false;
            }
            commandSupport[command] = worker;
            return true;
        };

        /**
         * 是否改变过
         *
         * @return {boolean}
         */
        Editor.prototype.isChanged = function () {
            var font = this.getFont();
            return this.fontHash !== getFontHash(font);
        };

        /**
         * 重置改变状态
         *
         * @param {boolean} changed 状态
         */
        Editor.prototype.setChanged = function (changed) {
            if (changed) {
                this.fontHash = 0;
            }
            else {
                var font = this.getFont();
                this.fontHash = getFontHash(font);
            }
        };

        /**
         * 添加到剪切板
         *
         * @param {Array} shapes 形状集合
         * @return {this}
         */
        Editor.prototype.setClipBoard = function (shapes) {
            clipboard.set(shapes, 'editor-shape');
            return this;
        };

        /**
         * 从剪切板中获取
         *
         * @return {this}
         */
        Editor.prototype.getClipBoard = function () {
            return clipboard.get('editor-shape');
        };

        /**
         * 获取焦点
         *
         */
        Editor.prototype.focus = function () {
            this.render.focus();
        };

        /**
         * 离开焦点
         *
         */
        Editor.prototype.blur = function () {
            this.render.blur();
        };

        /**
         * 注销
         */
        Editor.prototype.dispose = function () {
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
        };

        require('common/observable').mixin(Editor.prototype);

        return Editor;
    }
);
