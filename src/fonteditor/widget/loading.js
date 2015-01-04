/**
 * @file loading.js
 * @author mengke01
 * @date
 * @description
 * loading 对象
 */


define(
    function (require) {

        /**
         * 提示
         *
         * @type {Object}
         */
        var loading = {

            /**
             * 显示提示框
             *
             * @param {string} text 显示文字
             * @param {number} duration 显示时间
             * @return {this}
             */
            show: function (text, duration) {

                clearTimeout(this.showtimer);

                $('#loading span').html(text || '正在加载...');
                $('#loading').show();

                if (duration) {
                    this.showtimer = setTimeout(this.hide, duration);
                }

                return this;
            },

            /**
             * 隐藏
             */
            hide: function () {
                $('#loading').hide();
            }
        };

        return loading;
    }
);
