/**
 * @file setting-find-glyf.js
 * @author mengke01
 * @date
 * @description
 * 按unicode查找字形
 *
 */

define(
    function (require) {

        var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

        var tpl = ''
            + '<div class="form-inline">'
            +   '<select id="setting-find-condition" class="form-control">'
            +       '<option value="unicode" selected>按代码点查找字形</option>'
            +       '<option value="name">按名字查找字形</option>'
            +   '</select> '
            +   '<input value="" id="setting-find-value" class="form-control">'
            +   '<p class="form-line">例如：代码点："$21"，名字： "uniE001"</p>'
            + '</div>';


        return require('./setting').derive({

            title: '查找字形',

            getTpl: function () {
                return tpl;
            },

            validate: function () {
                var condition = $('#setting-find-condition').val();
                var value = $('#setting-find-value').val();

                if (!value.length) {
                    alert('请设置unicode!');
                    return false;
                }

                if (condition === 'unicode') {
                    if (value.match(unicodeREG)) {
                       value = value.split(',');
                    }
                    else {
                        value = value.split('').map(function (c) {
                            return '$' + c.charCodeAt(0).toString(16);
                        });
                    }
                }

                var setting = {};
                setting[condition] = value;

                return setting;
            }

        });
    }
);
