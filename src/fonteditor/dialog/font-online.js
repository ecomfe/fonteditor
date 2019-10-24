/**
 * @file 在线字体列表
 * @author mengke01(kekee000@gmail.com)
 */

import string from 'common/string';
import i18n from '../i18n/i18n';
import setting from './setting';
import onlineList from '../data/online-font';

export default setting.derive({

    title: i18n.lang.dialog_onlinefont,
    nofooter: true,

    getTpl() {

        let str = '<div class="list-group list-font-online">';
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

    set() {
        let me = this;
        let dialog = this.getDialog();
        dialog.find('.list-group').on('click', '.list-group-item', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let url = $(this).attr('data-url');
            dialog.find('.list-group').off('click', '.list-group-item');
            me.options.onChange && me.options.onChange.call(this, decodeURIComponent(url));
            $('#model-dialog').modal('hide');
        });
    }
});
