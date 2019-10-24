/**
 * @file 编辑器设置选项
 * @author mengke01(kekee000@gmail.com)
 */


import i18n from '../i18n/i18n';
import setting from './setting';
import lang from 'common/lang';
import program from '../widget/program';

export default setting.derive({

    title: i18n.lang.dialog_editor_setting,

    getTpl() {
        let tpl = require('../template/dialog/setting-editor.tpl');
        console.log(tpl);
        return tpl;
    },

    set(setting) {
        this.setting = lang.clone(setting);
        this.setFields(this.setting);
        let me = this;
        $('#setting-editor-default').on('click', function (e) {
            e.preventDefault();
            me.setting = program.setting.getDefault('editor');
            me.setFields(me.setting);
            me.oldSetting = null;
        });
    },
    onDispose() {
        $('#setting-editor-default').off('click');
    },
    validate() {
        return this.getFields(lang.clone(this.setting));
    }

});
