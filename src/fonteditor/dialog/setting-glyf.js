/**
 * @file setting-adjust-pos.js
 * @author mengke01
 * @date
 * @description
 * 设置自动调整字形位置
 */

define(
    function (require) {

        var tpl = require('../template/dialog/setting-glyf.tpl');
        var string = require('ttf/util/string');
        var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

        return require('./setting').derive({

            title: '调整字形',

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                $('#setting-glyf-unicode').on('blur', function (e) {
                    var val = $(this).val();
                    var ctlGlyfName = $('#setting-glyf-name');
                    if (val.match(unicodeREG)) {
                        val = Number('0x' + val.split(',')[0].slice(1));
                        ctlGlyfName.val(string.getUnicodeName(val));
                    }
                });
                this.setFields(setting || {});
            },
            onDispose: function () {
                $('#setting-glyf-unicode').off('blur');
            },
            validate: function () {

                var unicode = $('#setting-glyf-unicode').val();
                if (unicode && !unicode.match(unicodeREG)) {
                    alert('unicode设置不正确!');
                    return false;
                }

                var setting = this.getFields();

                if (setting.leftSideBearing === undefined
                    && setting.rightSideBearing === undefined
                    && setting.unicode === undefined
                    && setting.name === undefined
                ) {
                    alert('没有设置项目!');
                    return false;
                }

                return setting;
            }

        });
    }
);
