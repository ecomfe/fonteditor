/**
 * @file 编辑器设置管理
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var lang = require('common/lang');
        var settingDefault = require('../setting/support');

        var storage = window.localStorage;
        var cachedSetting = {};

        var setting = {

            /**
             * 根据名字获取默认设置
             * 1. 首先从缓存中读取
             * 2. 如果没有则加载保存的配置
             * 3. 如果没有则加载默认的
             *
             * @param {string} name 设置名字
             * @return {Object} 设置对象
             */
            get: function (name) {

                if (!name) {
                    throw 'setting name empty';
                }

                if (cachedSetting[name]) {
                    return cachedSetting[name];
                }

                var setting = null;
                var data = storage.getItem('setting.' + name);

                if (data) {
                    // 因为有可能版本更新导致字段缺失，这里需要覆盖一下字段
                    setting = lang.overwrite(this.getDefault(name), JSON.parse(data));
                }
                else {
                    setting = this.getDefault(name);
                }

                return cachedSetting[name] = setting;
            },

            /**
             * 保存设置
             *
             * @param {string} name 设置名字
             * @param {Object} setting 设置对象
             * @param {boolean} store 是否保存对象
             * @return {Object} 设置对象
             */
            set: function (name, setting, store) {

                if (!name) {
                    throw 'setting name empty';
                }

                if (store) {

                    // 如果和默认的配置相同则不需要保存配置
                    if (!lang.equals(setting, this.getDefault(name))) {
                        storage.setItem('setting.' + name, JSON.stringify(setting));
                    }
                    else {
                        storage.removeItem('setting.' + name);
                    }
                }

                return cachedSetting[name] = setting;
            },

            /**
             * 是否已保存配置
             *
             * @param {string} name 名字
             * @return {boolean} 是否已保存
             */
            isStored: function (name) {
                return !!storage.getItem('setting.' + name);
            },

            /**
             * 根据名字获取设置
             *
             * @param {string} name 设置名字
             * @return {Object} 设置对象
             */
            getDefault: function (name) {
                if (settingDefault[name]) {
                    return lang.clone(settingDefault[name]);
                }

                return null;
            }
        };

        return setting;
    }
);
