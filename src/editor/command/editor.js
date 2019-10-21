/**
 * @file 编辑器相关命令
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';
import computeBoundingBox from 'graphics/computeBoundingBox';
import commandList from '../menu/commandList';
import shapesSupport from '../shapes/support';
import setSelectedCommand from './setSelectedCommand';

export default {

    /**
     * 重置缩放
     *
     * @param {number} scale scale
     */
    rescale(scale) {
        this.coverLayer.clearShapes();
        let size = this.render.getSize();
        scale = scale || (512 / this.options.unitsPerEm);

        this.render.scaleTo(scale, {
            x: size.width / 2,
            y: size.height / 2
        });
        this.setMode();
    },

    /**
     * 放大视图
     */
    enlargeview() {
        let size = this.render.getSize();
        this.render.scale(1.25, {
            x: size.width / 2,
            y: size.height / 2
        });
    },

    /**
     * 缩小视图
     */
    narrowview() {
        let size = this.render.getSize();
        this.render.scale(0.8, {
            x: size.width / 2,
            y: size.height / 2
        });
    },

    /**
     * 撤销
     */
    undo() {
        let shapes = this.history.back();
        this.fontLayer.shapes.length = 0;
        this.addShapes(shapes);
        this.setMode();
    },

    /**
     * 恢复
     */
    redo() {
        let shapes = this.history.forward();
        this.fontLayer.shapes.length = 0;
        this.addShapes(shapes);
        this.setMode();
    },

    /**
     * 是否打开网格吸附
     *
     * @param {boolean} enabled 是否
     */
    gridsorption(enabled) {
        setSelectedCommand(commandList.editor, 'setting.gridsorption', !!enabled);
        this.options.sorption.enableGrid = this.sorption.enableGrid = !!enabled;
    },

    /**
     * 是否打开轮廓吸附
     *
     * @param {boolean} enabled 是否
     */
    shapesorption(enabled) {
        setSelectedCommand(commandList.editor, 'setting.shapesorption', !!enabled);
        this.options.sorption.enableShape = this.sorption.enableShape = !!enabled;
    },

    /**
     * 是否打开轮廓吸附
     *
     * @param {boolean} enabled 是否
     */
    showgrid(enabled) {
        setSelectedCommand(commandList.editor, 'setting.showgrid', !!enabled);
        this.options.axis.showGrid = this.axis.showGrid = !!enabled;
        this.axisLayer.refresh();
    },

    /**
     * 更多设置
     */
    moresetting() {
        this.fire('setting:editor', {
            setting: this.options
        });
    },

    /**
     * 添加path
     */
    addpath() {
        let me = this;
        // 此处由于监听down事件，需要延迟处理
        setTimeout(function () {
            me.setMode('addpath');
        }, 20);
    },

    /**
     * 添加自选图形
     *
     * @param {string} type 图形类型
     */
    addsupportshapes(type) {
        if (shapesSupport[type]) {
            this.setMode('addshapes', lang.clone(shapesSupport[type]));
        }
    },

    /**
     * 设置字体信息
     */
    fontsetting() {

        // 计算边界
        let box = computeBoundingBox.computePathBox.apply(
            null,
            this.fontLayer.shapes.map(function (shape) {
                return shape.points;
            })
        );

        let leftSideBearing = 0;
        let rightSideBearing = 0;

        if (box) {
            let scale = this.render.camera.scale;
            leftSideBearing = (box.x - this.axis.x) / scale;
            rightSideBearing = (this.rightSideBearing.p0.x - box.x - box.width) / scale;
        }

        if (this.font) {
            this.fire('setting:font', {
                setting: {
                    leftSideBearing: Math.round(leftSideBearing),
                    rightSideBearing: Math.round(rightSideBearing || 0),
                    unicode: this.font.unicode,
                    name: this.font.name
                }
            });
        }
    }
};
