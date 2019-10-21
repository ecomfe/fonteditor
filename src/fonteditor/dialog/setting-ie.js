/**
 * @file 导入和导出设置选项
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import setting from './setting';

import tpl from '../template/dialog/setting-ie.tpl';
import lang from 'common/lang';
import program from '../widget/program';

export default setting.derive({

    title: i18n.lang.dialog_import_and_export,

    getTpl() {
        return tpl;
    },

    set(setting) {
        this.setting = lang.clone(setting);
        this.setFields(this.setting);
        let me = this;
        $('#setting-ie-default').on('click', function (e) {
            e.preventDefault();
            me.setting = program.setting.getDefault('ie');
            me.setFields(me.setting);
            me.oldSetting = null;
        });
    },
    onDispose() {
        $('#setting-ie-default').off('click');
    },
    validate() {
        let setting = this.getFields(lang.clone(this.setting));
        return setting;
    }

});
