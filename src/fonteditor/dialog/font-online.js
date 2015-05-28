/**
 * @file 在线字体列表
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var string = require('common/string');
        var onlineList = require('../data/online-font');

        return require('./setting').derive({

            title: i18n.lang.dialog_onlinefont,
            nofooter: true,

            getTpl: function () {

                var str = '<div class="list-group">';
                onlineList.forEach(function (item, index) {
                    str += '<a data-url="' + item.url + '" href="'
                        +       item.url + '" class="list-group-item">'
                        +       '<span class="from">' + string.encodeHTML(item.from) + '</span>'
                        +       (index + 1) + '. '
                        +       string.encodeHTML(item.name)
                        +  '</a>';
                });

                str += '</div>';

                return str;
            },

            set: function () {
                var me = this;
                var dialog = this.getDialog();
                dialog.find('.list-group').on('click', '.list-group-item', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var url = $(this).attr('data-url');
                    dialog.find('.list-group').off('click', '.list-group-item').remove();
                    me.options.onChange && me.options.onChange.call(this, decodeURIComponent(url));
                    $('#model-dialog').modal('hide');
                });
            }
        });
    }
);
