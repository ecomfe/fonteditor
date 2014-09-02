/**
 * @file Layer.js
 * @author mengke01
 * @date 
 * @description
 * 层级基础对象
 */


define(
    function(require) {

        var guid = require('./util/guid');
        var ShapeConstructor = require('./shape/Shape');
        var lang = require('common/lang');

        /**
         * 创建一个shape对象，这里仅创建数据结构，具体绘制由Shape对象完成
         * 
         * @param {Object} options shape参数
         * @return {Object} shape数据结构
         */
        function createShape(options) {
            options = options || {};
            options.id = options.id || guid('shape');
            options.type = options.type || 'circle';
            options.layerId = this.id;
            return options;
        }


        /**
         * 设置canvas的绘制样式
         */
        function setContextStyle(context, options) {

            if(options.fillColor) {
                context.fillStyle = options.fillColor;
            }

            if(options.strokeColor) {
                context.strokeStyle = options.strokeColor;
            }

            if(options.strokeWidth) {
                context.strokeWidth = options.strokeWidth;
            }
        }


        /**
         * 对shape进行camera调整
         * 
         * @return {Array} 调整后的shape
         */
        function adjustCamera(shapes, camera) {
            var newShapes = [];

            newShapes = shapes.slice();

            return newShapes;
        }

        /**
         * 层级基础对象
         * 
         * @constructor
         */
        function Layer(context, options) {
            this.context = context;
            this.options = options || {};
            this.painter = this.options.painter;
            this.id = this.options.id || guid('layer');
            this.level = this.options.level;
            this.shapes = [];
            this.disabled = false;
        }


        lang.extend(Layer.prototype, {

            /**
             * 刷新painter
             * 
             * @return {Painter} this对象
             */
            refresh: function() {
                var support = this.painter.support;
                
                this.context.clearRect(0, 0, this.painter.width, this.painter.height);
                

                setContextStyle(this.context, this.options);

                this.context.beginPath();
                var context = this.context;
                var camera = this.painter.camera;
                this.shapes.forEach(function(shape) {

                    if(!shape['_shape']) {
                        shape['_shape'] = ShapeConstructor.clone(shape);
                    }

                    var drawer = support[shape.type];

                    if(drawer) {
                        if(camera.ratio != 1) {
                            drawer.adjust(shape, camera);
                        }
                        drawer.draw(context, shape['_shape']);
                    }
                });

                if(this.options.stroke) {
                    this.context.stroke();
                }
                else {
                    this.context.fill();
                }

                return this;
            },

            /**
             * 根据编号或索引获取一个Shape
             * @param {string|number} shape id或者shape index
             * @return {Painter} this对象
             */
            getShape: function(shape) {
                if(typeof shape === 'string') {
                    return this.shapes.filter(function(item) {
                        return item.id === shape;
                    })[0];
                }
                else if(typeof shape === 'number') {
                    return this.shapes[shape];
                }
                else if(typeof shape === 'object') {
                    return shape;
                }
            },

            /**
             * 添加一个Shape
             * @param {string} shape Shape 类型， 或者 Shape 对象
             * @return {Painter} this对象
             */
            addShape: function(shape, options) {
                if(typeof shape === 'string') {
                    options = options || {};
                    options.type = shape;
                    shape = createShape.call(this, options);
                    this.shapes.push(shape);
                    return shape;
                }
                else if(typeof shape === 'object') {
                    this.shapes.push(shape);
                    return shape;
                }
                else {
                    throw 'add shape faild';
                }
                
                return this;
            },

            /**
             * 移除一个Shape
             * @param {Shape|string|number} shape Shape对象或者ID或者索引号
             * @return {Painter} this对象
             */
            removeShape: function(shape) {
                var id = -1;
                if(typeof shape === 'object') {
                    id = this.shapes.indexOf(shape);
                }
                else if(typeof shape === 'string') {
                    this.shapes.forEach(function(item, i) {
                        if(item.id === shape) {
                            id = i;
                            return false;
                        }
                    });
                }
                else if(typeof shape === 'number') {
                    id = shape;
                }
                else {
                    throw 'need shape id to be removed';
                }

                if(id >=0 && id < this.shapes.length) {
                    var shape = this.shapes[id];
                    this.shapes.splice(id, 1);
                    return true;
                }

                return false;
            },


            /**
             * 获取当前坐标下的shape
             * 
             * @param {Object} p 坐标值
             * @return {Object} shape对象
             */
            getShapeIn: function(p) {
                var support = this.painter.support;
                var shapes = this.shapes;
                for(var i = 0, l = shapes.length; i < l; i++) {
                    if (support[shapes[i].type].isIn(shapes[i]['_shape'], p.x, p.y)) {
                        return shapes[i];
                    }
                }
            },

            /**
             * 移动到指定的偏移
             * @param {number} x 偏移
             * @param {number} y 偏移
             * @param {shape} shape对象
             */
            move: function(x, y, shape) {
                shape = this.getShape(shape);
                var shapes = [];
                if(shape) {
                    shapes.push(shape);
                }
                else {
                    shapes = this.shapes;
                }

                shapes.forEach(function(shape) {
                    var _shape = shape['_shape'];
                    _shape.x = _shape.x + x;
                    _shape.y= _shape.y + y;
                });
                
                return this;
            },

            /**
             * 注销本对象
             */
            dispose: function() {
                this.main = this.painter = this.context = this.options = null;
                this.shapes.length = 0;
                this.shapes = null;
            },

            /**
             * 获取当前坐标下的shape
             * 
             * @param {Object} options 参数选项
             * @return {Shape} Shape对象
             */
            createShape: function(options) {
                return createShape.call(this, options);
            }
        });

        return Layer;
    }
);
