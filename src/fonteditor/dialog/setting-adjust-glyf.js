/**
 * @file 设置调整字形
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import setting from './setting';

export default setting.derive({

    title: i18n.lang.dialog_adjust_glyph,

    getTpl() {
        return require('../template/dialog/setting-adjust-glyf.tpl');
    },

    set(setting) {
        this.setFields(setting || {});
    },

    validate() {
        let setting = this.getFields();

        if (setting.reverse === undefined
            && setting.mirror === undefined
            && setting.scale === undefined
            && setting.ajdustToEmBox === undefined
        ) {
            alert(i18n.lang.dialog_no_input);
            return false;
        }
        return setting;
    }

});
