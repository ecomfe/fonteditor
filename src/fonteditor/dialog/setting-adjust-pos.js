/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */
import i18n from '../i18n/i18n';
import setting from './setting';

export default setting.derive({

    title: i18n.lang.dialog_adjust_pos,

    getTpl() {
        return require('../template/dialog/setting-adjust-pos.tpl');
    },

    set(setting) {
        this.setFields(setting || {});
    },

    validate() {
        let setting = this.getFields();

        if (setting.leftSideBearing === undefined
            && setting.rightSideBearing === undefined
            && setting.verticalAlign === undefined
        ) {
            alert(i18n.lang.dialog_no_input);
            return false;
        }

        return setting;
    }

});

