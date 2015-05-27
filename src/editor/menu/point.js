/**
 * @file 点相关命令
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        return [
            {
                name: 'add',
                title: i18n.lang.addpoint
            },
            {
                name: 'remove',
                title: i18n.lang.removepoint
            },
            {
                name: 'onCurve',
                title: i18n.lang.oncurve
            },
            {
                name: 'offCurve',
                title: i18n.lang.offcurve
            },
            {
                name: 'asStart',
                title: i18n.lang.asstart
            }
        ];
    }
);
