/**
 * @file 形状组相关命令
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        return [
            {
                name: 'reversepoints',
                title: i18n.lang.reversepoints
            },
            {
                name: 'removeshapes',
                title: i18n.lang.removeshapes
            },
            {
                name: 'cutshapes',
                title: i18n.lang.cut
            },
            {
                name: 'copyshapes',
                title: i18n.lang.copy
            },
            {
                name: 'join',
                title: i18n.lang.joinshapes,
                items: [
                    {
                        name: 'joinshapes',
                        title: i18n.lang.joinshapes
                    },
                    {
                        name: 'intersectshapes',
                        title: i18n.lang.intersectshapes
                    },
                    {
                        name: 'tangencyshapes',
                        title: i18n.lang.tangencyshapes
                    }
                ]
            },
            {
                name: 'transform',
                title: i18n.lang.transform,
                items: [
                    {
                        name: 'rotateleft',
                        title: i18n.lang.rotateleft
                    },
                    {
                        name: 'rotateright',
                        title: i18n.lang.rotateright
                    },
                    {
                        name: 'flipshapes',
                        title: i18n.lang.flip
                    },
                    {
                        name: 'mirrorshapes',
                        title: i18n.lang.mirror
                    }
                ]
            },

            {
                name: 'alignshapes_',
                title: i18n.lang.alignshapes,
                items: [
                    {
                        name: 'alignshapes',
                        align: 'left',
                        title: i18n.lang.alignleft
                    },
                    {
                        name: 'alignshapes',
                        align: 'center',
                        title: i18n.lang.aligncenter
                    },
                    {
                        name: 'alignshapes',
                        align: 'right',
                        title: i18n.lang.alignright
                    },
                    {
                        name: 'alignshapes',
                        align: 'top',
                        title: i18n.lang.aligntop
                    },
                    {
                        name: 'alignshapes',
                        align: 'middle',
                        title: i18n.lang.alignmiddle
                    },
                    {
                        name: 'alignshapes',
                        align: 'bottom',
                        title: i18n.lang.aligndescent
                    }
                ]
            },
            {
                name: 'horizontalalignshapes_',
                title: i18n.lang.align,
                items: [
                    {
                        name: 'horizontalalignshapes',
                        align: 'left',
                        title: i18n.lang.alignleft
                    },
                    {
                        name: 'horizontalalignshapes',
                        align: 'center',
                        title: i18n.lang.aligncenter
                    },
                    {
                        name: 'horizontalalignshapes',
                        align: 'right',
                        title: i18n.lang.alignright
                    }
                ]
            },
            {
                name: 'verticalalignshapes_',
                title: i18n.lang.verticalalign,
                items: [
                    {
                        name: 'verticalalignshapes',
                        align: 'ascent',
                        title: i18n.lang.aligntop
                    },
                    {
                        name: 'verticalalignshapes',
                        align: 'middle',
                        title: i18n.lang.alignmiddle
                    },
                    {
                        name: 'verticalalignshapes',
                        align: 'descent',
                        title: i18n.lang.aligndescent
                    },
                    {
                        name: 'verticalalignshapes',
                        align: 'baseline',
                        title: i18n.lang.alignbaseline
                    }
                ]
            },
            {
                name: 'addreferenceline',
                title: i18n.lang.addboundreferenceline
            }
        ];
    }
);
