/**
 * @file setting-adjust.js
 * @author mengke01
 * @date
 * @description
 * 设置调整字形
 */

define(
    function (require) {

        var tpl = require('../template/dialog/setting-adjust-glyf.tpl');

        return require('./setting').derive({

            title: '调整字形',

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setFields(setting || {});
            },

            validate: function () {
                var setting = this.getFields();

                if (setting.reverse === undefined
                    && setting.mirror === undefined
                    && setting.scale === undefined
                    && setting.ajdustToEmBox === undefined
                ) {
                    alert('没有设置项目!');
                    return false;
                }

                return setting;
            }

        });
    }
);
