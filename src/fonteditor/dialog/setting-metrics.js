/**
 * @file 设置字体上标，下标信息
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import setting from './setting';
import string from 'common/string';
import program from '../widget/program';
import weightClass from 'fonteditor-core/ttf/enum/weightClass';
import widthClass from 'fonteditor-core/ttf/enum/widthClass';
import panose from 'fonteditor-core/ttf/enum/panose';


export default setting.derive({

    title: i18n.lang.dialog_metrics,

    style: 'setting-metrics',

    getTpl() {
        let tpl = require('../template/dialog/setting-metrics.tpl');
        // width and weight
        let optionsHolder = {
            lang: i18n.lang,
            weightOptions: Object.keys(weightClass).map(function (key) {
                    return '<option value="' + key + '">' + weightClass[key] + '</option>';
                }).join(''),
            widthOptions: Object.keys(widthClass).map(function (key) {
                    return '<option value="' + key + '">' + widthClass[key] + '</option>';
                }).join(''),
            panoseOptions: Object.keys(panose).map(function (key, index) {
                return ''
                    + '<div class="form-group">'
                    +   '<div class="input-group input-group-sm">'
                    +       '<span class="input-group-addon">' + (index + 1) + '-' + key + '</span>'
                    +       '<select data-field="' + key + '" data-type="number" class="form-control">'
                    +           panose[key].map(function (value, i) {
                                    return '<option value="' + i + '">' + value + '</option>';
                                }).join('')
                    +       '</select>'
                    +   '</div>'
                    + '</div>';
            }).join('')
        };
        return string.format(tpl, optionsHolder);
    },

    set(setting) {

        this.setFields(setting);

        let me = this;
        $('#setting-calc-metrics').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let metrics = program.ttfManager.calcMetrics();
            me.setFields(metrics);
        });
    },
    onDispose() {
        $('#setting-calc-metrics').off('click');
    },
    validate() {
        let setting = this.getFields();

        return setting;
    }
});
