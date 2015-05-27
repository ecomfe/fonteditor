/**
 * @file 用于国际化的字符串管理类
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var lang = require('common/lang');

        function appendLanguage(store, languageList) {
            languageList.forEach(function (item) {
                var language = item[0];
                store[language] = lang.extend(store[language] || {}, item[1]);
            });
            return store;
        }

        /**
         * 管理国际化字符，根据lang切换语言版本
         *
         * @param {Array} languageList 当前支持的语言列表
         * @param {string=} defaultLanguage 默认语言
         * languageList = [
         *     'en-us', // 语言名称
         *     langObject // 语言字符串列表
         * ]
         */
        function I18n(languageList, defaultLanguage) {
            this.store = appendLanguage({}, languageList);
            this.setLanguage('en-us' || defaultLanguage || navigator.language.toLowerCase());
        }


        /**
         * 设置语言
         *
         * @param {string} language 语言
         * @return {this}
         */
        I18n.prototype.setLanguage = function (language) {
            if (!this.store[language]) {
                language = 'en-us';
            }
            this.lang = this.store[this.language = language];
            return this;
        };

        /**
         * 添加一个语言字符串
         *
         * @param  {string} path 语言路径
         * @param {string} language 语言
         * @param {Object} langObject 语言对象
         * @return {this}
         */
        I18n.prototype.addLanguage = function (language, langObject) {
            appendLanguage(this.store, [[language, langObject]]);
            return this;
        };

        /**
         * 获取当前语言字符串
         * @param  {string} path 语言路径
         * @return {string=}      语言字符串
         */
        I18n.prototype.get = function (path) {
            var ref = path.split('.');
            var refObject = this.lang;
            var level;
            while (refObject != null && (level = ref.shift())) {
                refObject = refObject[level];
            }
            return refObject != null ?  refObject : '';
        };

        return I18n;
    }
);
