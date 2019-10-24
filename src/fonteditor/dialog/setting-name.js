/**
 * @file 设置字体命名信息
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import setting from './setting';

export default setting.derive({

    title: i18n.lang.fontinfo,

    getTpl() {
        return require('../template/dialog/setting-name.tpl');
    },

    set(setting) {
        this.setFields(setting);
    },

    validate() {
        let setting = this.getFields();
        return setting;
    }
});
