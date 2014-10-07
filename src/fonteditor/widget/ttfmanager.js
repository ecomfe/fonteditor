/**
 * @file ttf.js
 * @author mengke01
 * @date 
 * @description
 * ttf相关操作类
 */


define(
    function(require) {
        var lang = require('common/lang');
        var postName = require('ttf/enum/postName');
        var pathAdjust = require('graphics/pathAdjust');
        var History = require('editor/util/History'); 


        /**
         * 合并两个ttfObject，此处仅合并简单字形
         * 
         * @param {Object} ttf ttfObject
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * 
         * @return {Object} 合并后的ttfObject
         */
        function combine(ttf, imported, options) {
            options = options || {};

            // 调整glyf以适应打开的文件
            var scale = 1;
            // 对导入的轮廓进行缩放处理
            if (options.scale && imported.head.unitsPerEm && imported.head.unitsPerEm != ttf.head.unitsPerEm) {
                scale = ttf.head.unitsPerEm / imported.head.unitsPerEm;
            }

            var list = imported.glyf.filter(function(g, index) {
                return g.contours && g.contours.length //简单轮廓
                    && g.name != '.notdef' && g.name != '.null' && g.name != 'nonmarkingreturn'; // 非预定义字形
                    
            });

            list.forEach(function(g) {
                if (scale !== 1) {
                    g.contours.forEach(function(contour) {
                        pathAdjust(contour, scale, scale);
                    });
                }
                g.modify = 'new';
                ttf.glyf.push(g);
            });

            return list.length;
        }

        /**
         * 构造函数
         * 
         * @constructor
         * @param {ttfObject} ttf ttf对象
         */
        function Manager(ttf) {
            this.ttf = ttf;
            this.changed = false; // ttf是否被改过
            this.history = new History();
        }

        /**
         * 触发change
         * 
         * @param {boolean} pushHistory 是否存入history列表
         * @return {this}
         */
        Manager.prototype.fireChange = function(pushHistory) {
            pushHistory && this.history.add(lang.clone(this.ttf.glyf));
            this.changed = true;
            this.fire('change', {
                ttf: this.ttf
            });
            return this;
        };

        /**
         * 设置ttf
         * 
         * @param {ttfObject} ttf ttf对象
         * @return {this}
         */
        Manager.prototype.set = function(ttf) {

            if (this.ttf !== ttf) {
                this.ttf = ttf;
                this.history.reset();
                this.history.add(lang.clone(this.ttf.glyf));
                this.changed = false;
                this.fire('change', {
                    ttf: this.ttf
                });
            }

            return this;
        };

        /**
         * 获取ttf对象
         * 
         * @return {ttfObject} ttf ttf对象
         */
        Manager.prototype.get = function() {
            return this.ttf;
        };

        /**
         * 添加glyf
         * 
         * @param {Object} glyf glyf对象
         * 
         * @return {this}
         */
        Manager.prototype.addGlyf = function(glyf) {
            this.ttf.glyf.push(glyf);
            this.fireChange(true);
            return this;
        };

        /**
         * 合并两个ttfObject，此处仅合并简单字形
         * 
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * 
         * @return {this}
         */
        Manager.prototype.combine = function(imported, options) {
            var count = combine(this.ttf, imported, options);
            if (count) {
                this.fireChange(true);
            }
            return this;
        };


        /**
         * 删除指定字形
         * 
         * @param {Array} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.removeGlyf = function(indexList) {
            var glyf = this.ttf.glyf, count = 0;
            for(var i = glyf.length - 1; i >= 0; i--) {
                if (indexList.indexOf(i) >= 0 && glyf[i].name != '.notdef') {
                    glyf.splice(i, 1);
                    count++;
                }
            }

            if (count) {
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 设置unicode代码
         * 
         * @param {string} unicode unicode代码
         * @param {Array} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.setUnicode = function(unicode, indexList) {
            var glyf = this.ttf.glyf, list;
            if (indexList && indexList.length) {
                list = indexList.map(function(item) {
                    return glyf[item];
                });
            }
            else {
                list = glyf;
            }

            list = list.filter(function(g) {
                return g.name != '.notdef';
            });

            if (list.length) {

                unicode = Number('0x' + unicode.slice(1));

                list.forEach(function(g) {
                    g.unicode = [unicode];
                    g.name = unicode - 29 < 258 ? postName[unicode - 29] : 'uni' + unicode.toString(16).toUpperCase();
                    unicode++;
                });

                this.fireChange(true);
            }

            return this;
        };

        /**
         * 添加并体替换指定的glyf
         * 
         * @param {Array} glyfList 添加的列表
         * @param {Array} indexList 需要替换的索引列表
         * @return {Array} glyflist
         */
        Manager.prototype.appendGlyf = function(glyfList, indexList) {
            var glyf = this.ttf.glyf;
            if (indexList && indexList.length) {
                var l = Math.min(glyfList.length, indexList.length);
                for (var i = 0; i < l; i++) {
                    glyf[indexList[i]] = glyfList[i];
                }
                glyfList = glyfList.slice(l);
            }
            if (glyfList.length) {
                Array.prototype.splice.apply(glyf, [glyf.length, 0].concat(glyfList));
            }

            this.fireChange(true);
        };

        /**
         * 获取glyfList
         * 
         * @param {Array} indexList 索引列表
         * @return {Array} glyflist
         */
        Manager.prototype.getGlyf = function(indexList) {
            var glyf = this.ttf.glyf;
            return indexList.map(function(item) {
                return glyf[item];
            });
        };

        /**
         * 撤销
         * @return {this}
         */
        Manager.prototype.undo = function() {
            if (!this.history.atFirst()) {
                this.ttf.glyf = this.history.back();
                this.fireChange(false);
            }
        };


        /**
         * 重做
         * @return {this}
         */
        Manager.prototype.redo = function() {
            if (!this.history.atLast()) {
                this.ttf.glyf = this.history.forward();
                this.fireChange(false);
            }
        };

        /**
         * ttf是否被改变
         * @return {boolean}
         */
        Manager.prototype.isChanged = function() {
            return !!this.changed;
        };

        /**
         * 注销
         */
        Manager.prototype.dispose = function() {
            this.un();
            delete this.ttf;
        };

        require('common/observable').mixin(Manager.prototype);

        return Manager;
    }
);
