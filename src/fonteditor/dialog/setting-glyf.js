/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import setting from './setting';
import stringUtil from 'fonteditor-core/ttf/util/string';
const unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

export default setting.derive({

    title: i18n.lang.dialog_glyph_info,

    getTpl() {
        return require('../template/dialog/setting-glyf.tpl');
    },

    set(setting) {
        $('#setting-glyf-unicode').on('blur', function (e) {
            let val = $(this).val();
            let ctlGlyfName = $('#setting-glyf-name');
            if (!ctlGlyfName.val()) {
                if (val.match(unicodeREG)) {
                    val = Number('0x' + val.split(',')[0].slice(1));
                }
                else if (val) {
                    val = val.charCodeAt(0);
                }
                ctlGlyfName.val(stringUtil.getUnicodeName(val));
            }
        });
        this.setFields(setting || {});
    },
    onDispose() {
        $('#setting-glyf-unicode').off('blur');
    },
    validate() {

        let setting = this.getFields();

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
