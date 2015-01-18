/**
 * @file setting-ie.js
 * @author mengke01
 * @date
 * @description
 * 导入和导出设置选项
 */


define(
    function (require) {
        var lang = require('common/lang');
        var program = require('../widget/program');

        var tpl = ''

            + '<div class="form-inline">'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">导入svg文件时合并成单个字形</span>'
            +         '<span class="form-control">'
            +           '<input data-field="import.combinePath" type="checkbox">'
            +         '</span>'
            +       '</div>'
            +   '</div>'
            + '</div>'


            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +       '<span class="input-group-addon">保存设置</span>'
            +       '<span class="form-control"><input data-field="saveSetting" type="checkbox"></span>'
            +   '</div> <a href="#" id="setting-ie-default">重置为默认设置</a>'
            + '</div>';

        return require('./setting').derive({

            title: '导入和导出',

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setting = lang.clone(setting);
                this.setFields(this.setting);
                var me = this;
                $('#setting-ie-default').on('click', function (e) {
                    e.preventDefault();
                    me.setting = program.setting.getDefault('ie');
                    me.setFields(me.setting);
                });
            },

            validate: function () {
                var setting = this.getFields(this.setting);
                return setting;
            }

        });
    }
);
