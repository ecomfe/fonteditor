/**
 * @file setting-name.js
 * @author mengke01
 * @date
 * @description
 * 设置字体命名信息
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
