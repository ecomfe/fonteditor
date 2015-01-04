/**
 * @file History.js
 * @author mengke01
 * @date
 * @description
 * 历史记录保持器
 */


define(
    function (require) {

        var lang = require('common/lang');

        /**
         * 历史记录保持器
         *
         * @constructor
         * @param {Object} options 参数
         */
        function History(options) {
            options = options || {};
            this.maxRecord = options.maxRecord || 200; // 最多记录
            this.queue = [];
            this.index = 0;
        }

        /**
         * 添加新纪录
         *
         * @param {Object} object 添加的对象
         */
        History.prototype.add = function (object) {
            this.queue.splice(this.index + 1, this.maxRecord);
            this.queue.push(object);
            if (this.queue.length > this.maxRecord) {
                this.queue.shift();
            }
            this.index = this.queue.length - 1;
        };

        /**
         * 获取记录副本
         *
         * @param {number} index 索引号
         * @return {Object}
         */
        History.prototype.get = function (index) {
            index = index || this.index;
            return lang.clone(this.queue[index]);
        };

        /**
         * 获取前一记录
         *
         * @return {Object}
         */
        History.prototype.forward = function () {
            if (this.index < this.queue.length - 1) {
                this.index++;
            }
            return lang.clone(this.queue[this.index]);
        };

        /**
         * 获取后一记录
         *
         * @return {Object}
         */
        History.prototype.back = function () {
            if (this.index > 0) {
                this.index--;
            }
            return lang.clone(this.queue[this.index]);
        };

        /**
         * 是否在头部
         *
         * @return {boolean}
         */
        History.prototype.atFirst = function () {
            return this.index === 0;
        };

        /**
         * 是否尾部
         *
         * @return {boolean}
         */
        History.prototype.atLast = function () {
            var l = this.queue.length;
            return l === 0 || this.index === l - 1;
        };

        /**
         * 重置
         */
        History.prototype.reset = function () {
            delete this.queue;
            this.queue = [];
            this.index = 0;
        };

        return History;
    }
);
