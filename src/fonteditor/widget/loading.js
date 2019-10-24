/**
 * @file 加载提示组件
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';

/**
 * 提示
 *
 * @type {Object}
 */
const loading = {

    /**
     * 显示提示框
     *
     * @param {string} text 显示文字
     * @param {number} duration 显示时间
     * @param {string} status 显示的状态
     * @return {this}
     */
    show(text, duration, status) {

        clearTimeout(this.showtimer);
        let loading = $('#loading');
        loading.attr('data-status', status || '')
            .find('span')
            .html(text || i18n.lang.msg_loading);
        loading.show();

        if (duration) {
            this.showtimer = setTimeout(this.hide, duration);
        }

        return this;
    },

    /**
     * 显示错误提示框
     *
     * @param {string} text 显示文字
     * @param {number} duration 显示时间
     * @return {this}
     */
    error(text, duration) {
        this.show(text, duration, 'error');
        return this;
    },

    /**
     * 显示警告提示框
     *
     * @param {string} text 显示文字
     * @param {number} duration 显示时间
     * @return {this}
     */
    warn(text, duration) {
        this.show(text, duration, 'warn');
        return this;
    },

    /**
     * 隐藏
     */
    hide() {
        $('#loading').hide();
    }
};

export default loading;