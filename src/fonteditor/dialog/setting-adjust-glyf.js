/**
 * @file 设置调整字形
 * @author mengke01(kekee000@gmail.com)
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
