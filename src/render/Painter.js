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
        var computeBoundingBox = require('graphics/computeBoundingBox');
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
            this.resetSize();
            this.camera = new Camera({
                x: this.width / 2,
                y: this.height /2
            });

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
             * 
             * @return {this}
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
             * @return {this}
             */
            refresh: function() {
                this.layers.forEach(function(layer) {
                    layer.refresh();
                });
                return this;
            },

            /**
             * 根据编号或索引获取一个Layer
             * 
             * @param {string|number} layer id或者layer index
             * 
             * @return {Layer} layer对象
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
                else if(typeof layerId === 'object') {
                    return layerId;
                }
            },

            /**
             * 添加一个Layer
             * 
             * @param {Layer|string} layer layer对象，或者layer id
             * 
             * @return {Layer?} layer对象
             */
            addLayer: function(layer, options) {
                if(layer instanceof Layer) {
                    this.layers.push(layer);
                    return layer;
                }
                else if(typeof layer === 'string') {
                    options = options || {};
                    options.id = layer;
                    layer = createLayer.call(this, options);
                    this.layers.push(layer);
                    return layer;
                }
                else {
                    throw 'add layer faild';
                }
            },

            /**
             * 移除一个Layer
             * @param {Layer|string|number} layer layer对象或者ID或者索引号
             * 
             * @return {boolean} 是否成功
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
             * 
             * @return {Array} 选中的shape
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
             * 根据镜头调整坐标
             * 
             * @param {Layer} layerId
             * 
             * @return {this}
             */
            adjust: function(layerId) {

                var layers = [];
                if(layerId) {
                    var layer = this.getLayer(layerId);
                    layers.push(layer);
                }
                else {
                    layers = this.layers;
                }

                layers.forEach(function(layer) {
                    layer.adjust();
                });
                
                return this;
            },

            /**
             * 移动指定的偏移
             * 
             * @param {number} x 偏移
             * @param {number} y 偏移
             * @param {Layer} layerId
             * 
             * @return {this}
             */
            move: function(x, y, layerId) {

                var layers = [];
                if(layerId) {
                    var layer = this.getLayer(layerId);
                    layers.push(layer);
                }
                else {
                    layers = this.layers;
                }

                layers.forEach(function(layer) {
                    layer.move(x, y);
                });
                
                return this;
            },


            /**
             * 移动到指定的位置
             * 
             * @param {number} x 偏移
             * @param {number} y 偏移
             * @param {Layer} layerId
             * 
             * @return {this}
             */
            moveTo: function(x, y, layerId) {

                var layers = [];
                if(layerId) {
                    var layer = this.getLayer(layerId);
                    layers.push(layer);
                }
                else {
                    layers = this.layers;
                }

                var boundPoints = [];
                layers.forEach(function(layer) {
                    var bound = layer.getBound();
                    if(bound) {
                        boundPoints.push(bound);
                        boundPoints.push({x: bound.x + bound.width, y: bound.y + bound.height});
                    }
                });

                var bound = computeBoundingBox.computeBounding(boundPoints);

                if (bound) {
                    var mx = x - (bound.x + bound.width / 2);
                    var my = y - (bound.y + bound.height / 2);

                    layers.forEach(function(layer) {
                        layer.move(mx, my);
                    });
                }

                return this;
            },

            /**
             * 清空所有的layer中的图形
             * 
             * @return {this}
             */
            clearShapes: function() {
                var layers = this.layers;
                for(var i = 0, l = layers.length; i < l; i++) {
                    layers[i].clearShapes();
                }
                return this;
            },

            /**
             * 设置大小
             */
            resetSize: function() {

                if(this.options.width) {
                    this.main.style.width = this.options.width + 'px';
                }

                if(this.options.height) {
                    this.main.style.height = this.options.height + 'px';
                }

                var width = this.main.clientWidth;
                var height = this.main.clientHeight;

                this.layers.forEach(function(layer) {
                    document.getElementById(layer.id).width = width;
                    document.getElementById(layer.id).height = height;
                });

                this.width = width;
                this.height = height;

                return this;
            },

            /**
             * 获取操作面板大小
             * 
             * @return {Object} width, height
             */
            getSize: function() {
                return {
                    width: this.width,
                    height: this.height
                };
            },

            /**
             * 重置
             * 
             * @return {this}
             */
            reset: function() {
                
                this.clearShapes();
                this.resetSize();

                this.camera.reset({
                    x: this.width / 2,
                    y: this.height /2
                });
                return this;
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
