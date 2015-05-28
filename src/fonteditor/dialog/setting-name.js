/**
 * @file 设置字体命名信息
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = require('../template/dialog/setting-name.tpl');

        return require('./setting').derive({

            title: i18n.lang.fontinfo,

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setFields(setting);
            },

            validate: function () {
                var setting = this.getFields();
                return setting;
            }
        });
    }
);
