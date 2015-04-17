/**
 * @file ttf.js
 * @author mengke01
 * @date
 * @description
 * ttf相关操作类
 */


define(
    function (require) {
        var lang = require('common/lang');
        var History = require('editor/widget/History');
        var TTF = require('ttf/ttf');
        var string = require('ttf/util/string');

        /**
         * 清除glyf编辑状态
         *
         * @param {Array} glyfList glyf列表
         * @return {Array} glyf列表
         */
        function clearGlyfTag(glyfList) {
            glyfList.forEach(function (g) {
                delete g.modify;
            });
            return glyfList;
        }

        /**
         * 构造函数
         *
         * @constructor
         * @param {ttfObject} ttf ttf对象
         */
        function Manager(ttf) {
            this.ttf = new TTF(ttf);
            this.changed = false; // ttf是否被改过
            this.history = new History();
        }

        /**
         * 保存一个glyf副本
         *
         * @return {this}
         */
        Manager.prototype.pushHistory = function () {
            this.history.add(lang.clone(this.ttf.getGlyf()));
            return this;
        };

        /**
         * 触发change
         *
         * @param {boolean} pushHistory 是否存入history列表
         * @param {string} changeType 改变类型
         *
         * @return {this}
         */
        Manager.prototype.fireChange = function (pushHistory, changeType) {
            pushHistory && this.pushHistory();
            this.changed = true;
            this.fire('change', {
                ttf: this.ttf.get(),
                changeType: changeType || 'change'
            });
            return this;
        };

        /**
         * 设置ttf
         *
         * @param {ttfObject} ttf ttf对象
         * @return {this}
         */
        Manager.prototype.set = function (ttf) {

            if (this.ttf.get() !== ttf) {
                this.ttf.set(ttf);
                clearGlyfTag(this.ttf.getGlyf());

                this.history.reset();
                this.history.add(lang.clone(this.ttf.getGlyf()));

                this.changed = false;

                this.fire('set', {
                    ttf: this.ttf.get()
                });
            }

            return this;
        };

        /**
         * 获取ttf对象
         *
         * @return {ttfObject} ttf ttf对象
         */
        Manager.prototype.get = function () {
            return this.ttf.get();
        };

        /**
         * 查找glyf
         *
         * @param {Object} condition 查询条件
         *
         * @return {Array} 找到返回glyf列表
         */
        Manager.prototype.findGlyf = function (condition) {
            return this.ttf.findGlyf(condition);
        };

        /**
         * 在指定索引前面添加新的glyf
         *
         * @param {Object} glyf 对象
         * @param {number} beforeIndex 索引号
         *
         * @return {this}
         */
        Manager.prototype.insertGlyf = function (glyf, beforeIndex) {
            var glyfList = this.ttf.getGlyf();
            var unicode = 0x20;

            if (!glyf.unicode || !glyf.unicode.length) {
                // 找到unicode的最大值
                for (var i = glyfList.length - 1; i > 0; i--) {
                    var g = glyfList[i];
                    if (g.unicode && g.unicode.length) {
                        var u = Math.max.apply(null, g.unicode);
                        unicode = Math.max(u, unicode);
                    }
                }

                unicode++;

                if (unicode === 0xFFFF) {
                    unicode++;
                }

                glyf.unicode = [unicode];
            }

            if (!glyf.name) {
                glyf.name = string.getUnicodeName(glyf.unicode[0]);
            }

            glyf.modify = 'new';

            this.ttf.insertGlyf(glyf, beforeIndex);
            this.fireChange(true);

            return this;
        };

        /**
         * 合并两个ttfObject，此处仅合并简单字形
         *
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
         *
         * @return {this}
         */
        Manager.prototype.merge = function (imported, options) {

            var list = this.ttf.mergeGlyf(imported, options);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'new';
                });
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
        Manager.prototype.removeGlyf = function (indexList) {

            var list = this.ttf.removeGlyf(indexList);
            if (list.length) {
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
        Manager.prototype.setUnicode = function (unicode, indexList) {

            var list = this.ttf.setUnicode(unicode, indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 生成字形名称
         *
         * @param {Array} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.genGlyfName = function (indexList) {

            var list = this.ttf.genGlyfName(indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 清除字形名称
         *
         * @param {Array} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.clearGlyfName = function (indexList) {

            var list = this.ttf.clearGlyfName(indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
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
         * @return {this}
         */
        Manager.prototype.appendGlyf = function (glyfList, indexList) {

            var list = this.ttf.appendGlyf(glyfList, indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'new';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 替换指定的glyf
         *
         * @param {Object} glyf glyfobject
         * @param {string} index 需要替换的索引列表
         * @return {this}
         */
        Manager.prototype.replaceGlyf = function (glyf, index) {
            var list = this.ttf.replaceGlyf(glyf, index);
            if (list.length) {
                list[0].modify = 'edit';
                this.fireChange(true, 'replace');
            }
            return this;
        };

        /**
         * 调整glyf位置
         *
         * @param {Array} indexList 索引列表
         * @param {Object} setting 选项
         * @return {boolean}
         */
        Manager.prototype.adjustGlyfPos = function (indexList, setting) {

            var list = this.ttf.adjustGlyfPos(indexList, setting);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 调整glyf
         *
         * @param {Array} indexList 索引列表
         * @param {Object} setting 选项
         * @return {boolean}
         */
        Manager.prototype.adjustGlyf = function (indexList, setting) {

            var list = this.ttf.adjustGlyf(indexList, setting);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 设置glyf
         *
         * @param {Object} setting 选项
         * @param {Array} index 索引
         * @return {boolean}
         */
        Manager.prototype.updateGlyf = function (setting, index) {

            var glyf = this.getGlyf([index])[0];
            var changed = false;

            if (setting.unicode.length) {
                glyf.unicode = setting.unicode;
                glyf.modify = 'edit';
                changed = true;
            }

            if (setting.name !== glyf.name) {
                glyf.name = setting.name;
                glyf.modify = 'edit';
                changed = true;
            }

            if (
                (undefined !== setting.leftSideBearing
                    && setting.leftSideBearing !== glyf.leftSideBearing)
                || (undefined !== setting.rightSideBearing
                    && setting.rightSideBearing + (glyf.xMax || 0) !== glyf.advanceWidth)
            ) {
                var list = this.ttf.adjustGlyfPos([index], setting);
                if (list.length) {
                    list.forEach(function (g) {
                        g.modify = 'edit';
                    });
                    changed = true;
                }
            }

            changed && this.fireChange(true);

            return this;
        };


        /**
         * 获取glyfList
         *
         * @param {Array} indexList 索引列表
         * @return {Array} glyflist
         */
        Manager.prototype.getGlyf = function (indexList) {
            return this.ttf.getGlyf(indexList);
        };

        /**
         * 设置名字和头部信息
         *
         * @param {Object} info 设置
         * @return {this}
         */
        Manager.prototype.setInfo = function (info) {
            var changed = false;
            if (this.ttf.get().head.unitsPerEm !== info.unitsPerEm) {
                changed = true;
            }
            this.ttf.setName(info);
            this.ttf.setHead(info);

            if (changed) {
                this.fireChange(false);
            }

            return this;
        };

        /**
         * 设置度量信息
         *
         * @param {Object} info 设置
         * @return {this}
         */
        Manager.prototype.setMetrics = function (info) {
            var changed = false;
            if (this.ttf.get().hhea.descent !== info.descent) {
                changed = true;
            }
            this.ttf.setHhea(info);
            this.ttf.setOS2(info);
            this.ttf.setPost(info);

            if (changed) {
                this.fireChange(false);
            }

            return this;
        };

        /**
         * 撤销
         * @return {this}
         */
        Manager.prototype.undo = function () {
            if (!this.history.atFirst()) {
                this.ttf.setGlyf(this.history.back());
                this.fireChange(false);
            }

            return this;
        };


        /**
         * 重做
         * @return {this}
         */
        Manager.prototype.redo = function () {
            if (!this.history.atLast()) {
                this.ttf.setGlyf(this.history.forward());
                this.fireChange(false);
            }

            return this;
        };

        /**
         * ttf是否被改变
         *
         * @return {boolean}
         */
        Manager.prototype.isChanged = function () {
            return !!this.changed;
        };

        /**
         * 设置状态
         *
         * @param {string} state 状态值 new/saved
         * @return {this}
         */
        Manager.prototype.setState = function (state) {
            if (state === 'new') {
                this.changed = false;
            }
            else if (state === 'saved') {
                this.ttf.get().glyf.forEach(function (g) {
                    delete g.modify;
                });

                this.fire('change', {
                    ttf: this.ttf.get(),
                    changeType: state
                });

                this.changed = false;
            }

            return this;
        };

        Manager.prototype.clearGlyfTag = clearGlyfTag;

        /**
         * 设置状态
         * @return {this}
         */
        Manager.prototype.calcMetrics = function () {
            if (this.ttf) {
                return this.ttf.calcMetrics();
            }
        };



        /**
         * 注销
         */
        Manager.prototype.dispose = function () {
            this.un();
            delete this.ttf;
        };

        require('common/observable').mixin(Manager.prototype);

        return Manager;
    }
);
