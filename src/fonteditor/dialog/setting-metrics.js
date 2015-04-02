/**
 * @file setting-name.js
 * @author mengke01
 * @date
 * @description
 * 设置字体上标，下标信息
 */

define(
    function (require) {

        var tpl = require('../template/dialog/setting-metrics.tpl');
        var program = require('../widget/program');
        var weightClass = require('ttf/enum/weightClass');
        var widthClass = require('ttf/enum/widthClass');
        var panose = [
            'bFamilyType', 'bSerifStyle', 'bWeight', 'bProportion', 'bContrast',
            'bStrokeVariation', 'bArmStyle', 'bLetterform', 'bMidline', 'bXHeight'
        ];


        return require('./setting').derive({

            title: '字体度量',

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {

                // width and weight
                var html = '';

                Object.keys(weightClass).forEach(function (key) {
                    html += '<option value="' + key + '">' + weightClass[key] + '</option>';
                });

                $('#setting-weight').html(html);

                html = '';
                Object.keys(widthClass).forEach(function (key) {
                    html += '<option value="' + key + '">' + widthClass[key] + '</option>';
                });
                $('#setting-width').html(html);

                setting.panose = panose.map(function (name) {
                    return setting[name];
                }).join('-');

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
                var length = panose.length;
                (setting.panose || '').split('-').forEach(function (val, i) {
                    if (i < length) {
                        setting[panose[i]] = (+val || 0) & 0xF;
                    }
                });

                return setting;
            }
        });
    }
);
