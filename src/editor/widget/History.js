/**
 * @file 历史记录保持器
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';

export default class History {

    /**
     * 历史记录保持器
     *
     * @constructor
     * @param {Object} options 参数
     */
    constructor(options = {}) {
        this.maxRecord = options.maxRecord || 200; // 最多记录
        this.queue = [];
        this.index = 0;
    }

    /**
     * 添加新纪录
     *
     * @param {Object} object 添加的对象
     */
    add(object) {
        this.queue.splice(this.index + 1, this.maxRecord);
        this.queue.push(object);
        if (this.queue.length > this.maxRecord) {
            this.queue.shift();
        }
        this.index = this.queue.length - 1;
    }

    /**
     * 获取记录副本
     *
     * @param {number} index 索引号
     * @return {Object}
     */
    get(index) {
        index = index || this.index;
        return lang.clone(this.queue[index]);
    }

    /**
     * 获取前一记录
     *
     * @return {Object}
     */
    forward() {
        if (this.index < this.queue.length - 1) {
            this.index++;
        }
        return lang.clone(this.queue[this.index]);
    }

    /**
     * 获取后一记录
     *
     * @return {Object}
     */
    back() {
        if (this.index > 0) {
            this.index--;
        }
        return lang.clone(this.queue[this.index]);
    }

    /**
     * 是否在头部
     *
     * @return {boolean}
     */
    atFirst() {
        return this.index === 0;
    }

    /**
     * 是否尾部
     *
     * @return {boolean}
     */
    atLast() {
        let l = this.queue.length;
        return l === 0 || this.index === l - 1;
    }

    /**
     * 重置
     */
    reset() {
        delete this.queue;
        this.queue = [];
        this.index = 0;
    }
}
