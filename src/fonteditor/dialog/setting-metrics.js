/**
 * @file 设置字体上标，下标信息
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = require('../template/dialog/setting-metrics.tpl');
        var string = require('common/string');
        var program = require('../widget/program');
        var weightClass = require('fonteditor-core/ttf/enum/weightClass');
        var widthClass = require('fonteditor-core/ttf/enum/widthClass');
        var panose = require('fonteditor-core/ttf/enum/panose');


        return require('./setting').derive({

            title: i18n.lang.dialog_metrics,

            style: 'setting-metrics',

            getTpl: function () {
                // width and weight
                var optionsHolder = {
                    lang: i18n.lang
                };

                optionsHolder.weightOptions = Object.keys(weightClass).map(function (key) {
                    return '<option value="' + key + '">' + weightClass[key] + '</option>';
                }).join('');

                optionsHolder.widthOptions = Object.keys(widthClass).map(function (key) {
                    return '<option value="' + key + '">' + widthClass[key] + '</option>';
                }).join('');

                optionsHolder.panoseOptions = Object.keys(panose).map(function (key, index) {
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
                }).join('');

                return string.format(tpl, optionsHolder);
            },

            set: function (setting) {

                this.setFields(setting);

                var me = this;
                $('#setting-calc-metrics').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var metrics = program.ttfManager.calcMetrics();
                    me.setFields(metrics);
                });
            },
            onDispose: function () {
                $('#setting-calc-metrics').off('click');
            },
            validate: function () {
                var setting = this.getFields();

                return setting;
            }
        });
    }
);
