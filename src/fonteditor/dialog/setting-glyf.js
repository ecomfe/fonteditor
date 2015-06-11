/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = require('../template/dialog/setting-glyf.tpl');
        var string = require('ttf/util/string');
        var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

        return require('./setting').derive({

            title: i18n.lang.dialog_adjust_glyph,

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                $('#setting-glyf-unicode').on('blur', function (e) {
                    var val = $(this).val();
                    var ctlGlyfName = $('#setting-glyf-name');
                    if (!ctlGlyfName.val()) {
                        if (val.match(unicodeREG)) {
                            val = Number('0x' + val.split(',')[0].slice(1));
                        }
                        else if (val) {
                            val = val.charCodeAt(0);
                        }
                        ctlGlyfName.val(string.getUnicodeName(val));
                    }
                });
                this.setFields(setting || {});
            },
            onDispose: function () {
                $('#setting-glyf-unicode').off('blur');
            },
            validate: function () {

                var setting = this.getFields();

                if (setting.leftSideBearing === undefined
                    && setting.rightSideBearing === undefined
                    && setting.unicode === undefined
                    && setting.name === undefined
                ) {
                    alert(i18n.lang.dialog_no_input);
                    return false;
                }

                return setting;
            }

        });
    }
);
