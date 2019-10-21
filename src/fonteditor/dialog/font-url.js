/**
 * @file 读取线上字体
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import setting from './setting';

const tpl = ''
    +   '<div class="input-group input-group-sm">'
    +       '<span class="input-group-addon">' + i18n.lang.dialog_fonturl + '</span>'
    +       '<input data-field="url" type="text" class="form-control">'
    +   '</div>';

export default setting.derive({

    title: i18n.lang.dialog_fonturl,

    getTpl() {
        return tpl;
    },

    validate() {
        let setting = this.getFields();
        if (setting.url) {
            return setting.url;
        }
    }
});

