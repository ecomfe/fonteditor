/**
 * @file 设置字体命名信息
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var tpl = require('../template/dialog/setting-name.tpl');

        return require('./setting').derive({

            title: '字体信息',

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
