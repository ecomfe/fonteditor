/**
 * @file Painter.js
 * @author mengke01
 * @date 
 * @description
 * 画布对象
 */


define(
    function(require) {
        
        var guid = require('./util/guid');
        var Layer = require('./Layer');
        var lang = require('common/lang');
        var SupportShape = require('./shape/support');
        var Camera = require('./Camera');
        var MAX_LEVEL = 10000;

        /**
         * 创建一个canvas对象
         * 
         * @return {Canvas} canvas对象 
         */
        function createCanvas(options) {

            var canvas = document.createElement('canvas');
            var level = options.level || 1;

            canvas.id = options.id;
            canvas.width = options.width;
            canvas.height = options.height;
            canvas.style.position = 'absolute';
            canvas.style.zIndex = level > MAX_LEVEL ? 1 : level;

            if(options.background) {
                canvas.style.background = options.background;
            }

            return canvas;
        }

        /**
         * 创建一个Layer对象
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

            var canvas = createCanvas(options);
            this.main.appendChild(canvas);
            return new Layer(canvas.getContext('2d'), options);
        }

        /**
         * 画布对象
         * 
         * @constructor
         */
        function Painter(main, options){
            this.main = main;
            this.options = options || {};
            this.layers = [];

            this.main.style.position = 'relative';
            this.width = this.options.width || this.main.clientWidth;
            this.height = this.options.height || this.main.clientHeight;

            this.camera = new Camera({
                x: this.width / 2,
                y: this.height /2
            }, 1);

            var support = {};
            Object.keys(SupportShape).forEach(function(shape) {
                support[shape] = new SupportShape[shape]();
            });
            this.support = support;
        }

        lang.extend(Painter.prototype, {

            /**
             * 增加一个支持的shape类型
             * 
             * @param {Object} shape 支持类型
             * @return {Painter} 绘制对象
             */
            addSupport: function(shape) {
                if (this.support[shape.type]) {
                    throw 'exist the same shape type';
                }
                this.support[shape.type] = shape;
            },

            /**
             * 刷新painter
             * 
             * @return {Painter} this对象
             */
            refresh: function() {
                this.layers.forEach(function(layer) {
                    layer.refresh();
                });
                return this;
            },

            /**
             * 对layer进行排序
             * 
             * @return {Painter} this对象
             */
            sortLayer: function() {
                this.layers.sort(function(a, b) {
                    return a.level > b.level ? -1 : a.level == b.level ? 0 : 1;
                });
            },

            /**
             * 根据编号或索引获取一个Layer
             * @param {string|number} layer id或者layer index
             * @return {Painter} this对象
             */
            getLayer: function(layerId) {
                if(typeof layerId === 'string') {
                    return this.layers.filter(function(item) {
                        return item.id === layerId;
                    })[0];
                }
                else if(typeof layerId === 'number') {
                    return this.layers[layerId];
                }
            },

            /**
             * 添加一个Layer
             * @param {Layer|string} layer layer对象，或者layer id
             * @return {Painter} this对象
             */
            addLayer: function(layer, options) {
                if(layer instanceof Layer) {
                    this.layers.push(layer);
                    this.sortLayer();
                    return layer;
                }
                else if(typeof layer === 'string') {
                    options = options || {};
                    options.id = layer;
                    layer = createLayer.call(this, options);
                    this.layers.push(layer);
                    this.sortLayer();
                    return layer;
                }
                else {
                    throw 'add layer faild';
                }
            },

            /**
             * 移除一个Layer
             * @param {Layer|string|number} layer layer对象或者ID或者索引号
             * @return {Painter} this对象
             */
            removeLayer: function(layer) {
                var id = -1;
                if(layer instanceof Layer) {
                    id = this.layers.indexOf(layer);
                }
                else if(typeof layer === 'string') {
                    this.layers.forEach(function(item, i) {
                        if(item.id === layer) {
                            id = i;
                            return false;
                        }
                    });
                }
                else if(typeof id === 'number') {
                    id = id;
                }
                else {
                    throw 'need layer id to be removed';
                }

                if(id >=0 && id < this.layers.length) {
                    layer = this.layers[id];
                    layer.dispose();
                    // 移除canvas
                    this.main.removeChild(document.getElementById(layer.id));
                    this.layers.splice(id, 1);
                    return true;
                }

                return false;
            },

            /**
             * 获取当前坐标下的shape
             * 
             * @param {string} p [p description]
             * @return {[type]} [return description]
             */
            getShapeIn: function(p) {
                var layers = this.layers.filter(function(layer) {
                    return !layer.disabled;
                });
                for(var i = 0, l = layers.length; i < l; i++) {
                    var s = layers[i].getShapeIn(p);
                    if (s) {
                        return s;
                    }
                }
            },

            /**
             * 注销本对象
             */
            dispose: function() {
                var layers = this.layers;
                for(var i = 0, l = layers.length; i < l; i++) {
                    layers[i].dispose();
                    // 移除canvas
                    this.main.removeChild(document.getElementById(layers[i].id));
                }

                this.main = this.layers = this.options = null;
            },

            /**
             * 创建一个Layer对象
             * 
             * @param {Object} options 参数选项
             * @return {Layer} Layer对象
             */
            createLayer: function(options) {
                return createLayer.call(this, options);
            }

        });

        return Painter;
    }
);
