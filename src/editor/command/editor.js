/**
 * @file editor.js
 * @author mengke01
 * @date
 * @description
 * 编辑器相关命令
 */


define(
    function (require) {
        var lang = require('common/lang');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var commandList = require('../menu/commandList');
        var shapesSupport = require('../shapes/support');
        var menuUtil = require('../menu/util');

        return {

            /**
             * 重置缩放
             */
            rescale: function () {
                this.coverLayer.clearShapes();
                var size = this.render.getSize();
                var scale = 512 / this.options.unitsPerEm;

                this.render.scaleTo(scale, {
                    x: size.width / 2,
                    y: size.height / 2
                });
                this.setMode();
            },


            /**
             * 撤销
             */
            undo: function () {
                var shapes = this.history.back();
                this.fontLayer.shapes.length = 0;
                this.setShapes(shapes);
                this.setMode();
            },

            /**
             * 恢复
             */
            redo: function () {
                var shapes = this.history.forward();
                this.fontLayer.shapes.length = 0;
                this.setShapes(shapes);
                this.setMode();
            },

            /**
             * 是否打开网格吸附
             * @param {boolean} enabled 是否
             */
            gridsorption: function (enabled) {
                menuUtil.setSelected(commandList.editor, 'setting.gridsorption', !!enabled);
                this.options.sorption.enableGrid = this.sorption.enableGrid = !!enabled;
            },

            /**
             * 是否打开轮廓吸附
             * @param {boolean} enabled 是否
             */
            shapesorption: function (enabled) {
                menuUtil.setSelected(commandList.editor, 'setting.shapesorption', !!enabled);
                this.options.sorption.enableShape = this.sorption.enableShape = !!enabled;
            },

            /**
             * 是否打开轮廓吸附
             * @param {boolean} enabled 是否
             */
            showgrid: function (enabled) {
                menuUtil.setSelected(commandList.editor, 'setting.showgrid', !!enabled);
                this.options.axis.showGrid = this.axis.showGrid = !!enabled;
                this.axisLayer.refresh();
            },

            /**
             * 更多设置
             */
            moresetting: function () {
                this.fire('setting:editor', {
                    setting: this.options
                });
            },

            /**
             * 添加path
             */
            addpath: function () {
                this.setMode('addpath');
            },

            /**
             * 添加自选图形
             * @param {string} type 图形类型
             */
            addsupportshapes: function (type) {
                if (shapesSupport[type]) {
                    this.setMode('addshapes', lang.clone(shapesSupport[type]));
                }
            },

            /**
             * 设置字体信息
             */
            fontsetting: function () {

                // 计算边界
                var box = computeBoundingBox.computePathBox.apply(
                    null,
                    this.fontLayer.shapes.map(function (shape) {
                        return shape.points;
                    })
                );

                var leftSideBearing = 0;
                var rightSideBearing = 0;

                if (box) {
                    var scale = this.render.camera.scale;
                    leftSideBearing = (box.x - this.axis.x) / scale;
                    rightSideBearing = (this.rightSideBearing.p0.x - box.x - box.width) / scale;
                }

                this.fire('setting:font', {
                    setting: {
                        leftSideBearing: Math.round(leftSideBearing),
                        rightSideBearing: Math.round(rightSideBearing || 0),
                        unicode: this.font.unicode,
                        name: this.font.name
                    }
                });
            }
        };
    }
);
