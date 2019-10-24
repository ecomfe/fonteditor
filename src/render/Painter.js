/**
 * @file 绘制对象，负责管理Layer
 * @author mengke01(kekee000@gmail.com)
 */

import guid from './util/guid';
import Layer from './Layer';
import pixelRatio from 'common/getPixelRatio';
import SupportShape from './shape/support';
import Camera from './Camera';
import computeBoundingBox from 'graphics/computeBoundingBox';

const MAX_LEVEL = 10000;

/**
 * 创建一个canvas对象
 *
 * @param {Object} options 参数选项
 * @param {string} options.id 编号
 * @param {number} options.level 层级
 * @param {number} options.width 宽度
 * @param {number} options.height 高度
 *
 * @return {Canvas} canvas对象
 */
function createCanvas(options) {

    let canvas = document.createElement('canvas');
    let level = options.level || 1;

    canvas.id = options.id;
    canvas.width = options.width;
    canvas.height = options.height;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = level > MAX_LEVEL ? 1 : level;

    if (options.background) {
        canvas.style.background = options.background;
    }

    return canvas;
}

/**
 * 创建一个Layer对象
 *
 * @param {Object} options 参数选项
 * @param {string} options.id 编号
 * @param {number} options.level 层级
 * @param {number} options.width 宽度
 * @param {number} options.height 高度
 *
 * @return {Layer} Layer对象
 */
function createLayer(options) {
    options = options || {};
    options.id = options.id || guid('layer');
    options.width = this.width;
    options.height = this.height;
    options.level = options.level || 1;
    options.painter = this;

    let canvas = createCanvas(options);
    this.main.appendChild(canvas);
    return new Layer(canvas.getContext('2d'), options);
}

export default class Painter {

    /**
     * 画布对象
     *
     * @constructor
     * @param {HTMLElement} main 主元素
     * @param {Object} options 参数选项
     */
    constructor(main, options = {}) {
        this.main = main;
        this.options = options;
        this.layers = [];

        this.main.style.position = 'relative';
        this.resetSize();
        this.camera = new Camera({
            x: this.width / 2,
            y: this.height / 2
        });

        // 保存支持的shape类型
        let support = {};
        Object.keys(SupportShape).forEach(function (shape) {
            support[shape] = new SupportShape[shape]();
        });
        this.support = support;
    }

    /**
     * 增加一个支持的shape类型
     *
     * @param {Object} shape 支持类型
     * @see ./shape/Shape
     * @return {this}
     */
    addSupport(shape) {
        if (this.support[shape.type]) {
            throw 'exist the same shape type';
        }

        this.support[shape.type] = shape;
        return this;
    }

    /**
     * 刷新painter
     *
     * @return {this}
     */
    refresh() {
        this.layers.forEach(function (layer) {
            layer.refresh();
        });
        return this;
    }

    /**
     * 根据编号或索引获取一个Layer
     *
     * @param {Object|string|number} layerId layer对象 或者layer id或者layer index
     *
     * @return {Layer} layer对象
     */
    getLayer(layerId) {
        if (typeof layerId === 'string') {
            return this.layers.filter(function (item) {
                return item.id === layerId;
            })[0];
        }
        else if (typeof layerId === 'number') {
            return this.layers[layerId];
        }
        else if (typeof layerId === 'object') {
            return layerId;
        }
    }

    /**
     * 添加一个Layer
     *
     * @param {Layer|string} layer layer对象，或者layer id
     * @param {Object} options 参数
     * @return {Layer} layer对象
     */
    addLayer(layer, options) {
        if (layer instanceof Layer) {
            this.layers.push(layer);
            return layer;
        }
        else if (typeof layer === 'string') {
            options = options || {};
            options.id = layer;
            layer = createLayer.call(this, options);
            this.layers.push(layer);
            return layer;
        }

        throw 'add layer faild';
    }

    /**
     * 移除一个Layer
     *
     * @param {Layer|string|number} layer layer对象或者ID或者索引号
     * @return {boolean} 是否成功
     */
    removeLayer(layer) {
        let id = -1;

        if (layer instanceof Layer) {
            id = this.layers.indexOf(layer);
        }
        else if (typeof layer === 'string') {
            for (let i = 0, l = this.layers.length; i < l; i++) {
                if (layer === this.layers[i].id) {
                    id = i;
                    break;
                }
            }
        }
        else if (typeof id === 'number') {
            id = id;
        }
        else {
            throw 'need layer id to be removed';
        }

        if (id >= 0 && id < this.layers.length) {
            layer = this.layers[id];
            layer.dispose();
            // 移除canvas
            this.main.removeChild(document.getElementById(layer.id));
            this.layers.splice(id, 1);
            return true;
        }

        return false;
    }

    /**
     * 获取当前坐标下的shape
     *
     * @param {Object} p 坐标对象
     * @param {number} p.x 坐标对象
     * @param {number} p.y 坐标对象
     * @return {Array} 选中的shape
     */
    getShapeIn(p) {
        let layers = this.layers.filter(function (layer) {
            return !layer.disabled;
        });
        for (let i = 0, l = layers.length; i < l; i++) {
            let s = layers[i].getShapeIn(p);
            if (s) {
                return s;
            }
        }
    }

    /**
     * 根据镜头调整坐标
     *
     * @param {Object|number|string} layerId layer对象
     *
     * @return {this}
     */
    adjust(layerId) {

        let layers = [];
        if (layerId) {
            let layer = this.getLayer(layerId);
            layers.push(layer);
        }
        else {
            layers = this.layers;
        }

        layers.forEach(function (layer) {
            layer.adjust();
        });

        return this;
    }

    /**
     * 移动指定的偏移
     *
     * @param {number} x 偏移
     * @param {number} y 偏移
     * @param {Object|number|string} layerId layer对象
     *
     * @return {this}
     */
    move(x, y, layerId) {

        let layers = [];
        if (layerId) {
            let layer = this.getLayer(layerId);
            layers.push(layer);
        }
        else {
            layers = this.layers;
        }

        layers.forEach(function (layer) {
            layer.move(x, y);
        });

        return this;
    }


    /**
     * 移动到指定的位置
     *
     * @param {number} x x偏移
     * @param {number} y y偏移
     * @param {Object|number|string} layerId layer对象
     *
     * @return {this}
     */
    moveTo(x, y, layerId) {

        let layers = [];
        if (layerId) {
            let layer = this.getLayer(layerId);
            layers.push(layer);
        }
        else {
            layers = this.layers;
        }

        let boundPoints = [];
        layers.forEach(function (layer) {
            let bound = layer.getBound();
            if (bound) {
                boundPoints.push(bound);
                boundPoints.push({x: bound.x + bound.width, y: bound.y + bound.height});
            }
        });

        let bound = computeBoundingBox.computeBounding(boundPoints);

        if (bound) {
            let mx = x - (bound.x + bound.width / 2);
            let my = y - (bound.y + bound.height / 2);

            layers.forEach(function (layer) {
                layer.move(mx, my);
            });
        }

        return this;
    }

    /**
     * 清空所有的layer中的图形
     *
     * @return {this}
     */
    clearShapes() {
        let layers = this.layers;
        for (let i = 0, l = layers.length; i < l; i++) {
            layers[i].clearShapes();
        }
        return this;
    }

    /**
     * 设置大小
     *
     * @return {this}
     */
    resetSize() {

        if (this.options.width) {
            this.main.style.width = this.options.width + 'px';
        }

        if (this.options.height) {
            this.main.style.height = this.options.height + 'px';
        }

        let width = this.main.clientWidth;
        let height = this.main.clientHeight;

        this.layers.forEach(function (layer) {
            document.getElementById(layer.id).style.width = width + 'px';
            document.getElementById(layer.id).style.height = height + 'px';
            document.getElementById(layer.id).width = width * pixelRatio;
            document.getElementById(layer.id).height = height * pixelRatio;
        });

        this.width = width;
        this.height = height;

        return this;
    }

    /**
     * 获取操作面板大小
     *
     * @return {Object} width, height
     */
    getSize() {
        return {
            width: this.width,
            height: this.height
        };
    }

    /**
     * 重置
     *
     * @return {this}
     */
    reset() {

        this.clearShapes();
        this.resetSize();

        this.camera.reset({
            x: this.width / 2,
            y: this.height / 2
        });
        return this;
    }

    /**
     * 注销本对象
     */
    dispose() {
        let layers = this.layers;
        for (let i = 0, l = layers.length; i < l; i++) {
            layers[i].dispose();
            // 移除canvas
            this.main.removeChild(document.getElementById(layers[i].id));
        }

        this.main = this.layers = this.options = null;
    }

    /**
     * 创建一个Layer对象
     *
     * @param {Object} options 参数选项
     * @return {Layer} Layer对象
     */
    createLayer(options) {
        return createLayer.call(this, options);
    }

}
