/**
 * @file 形状相关命令
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
export default [
    {
        name: 'removeshapes',
        title: i18n.lang.removeshapes
    },
    {
        name: 'reversepoints',
        title: i18n.lang.reversepoints
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
        name: 'order',
        title: i18n.lang.order,
        items: [
            {
                name: 'topshape',
                title: i18n.lang.topshape
            },
            {
                name: 'bottomshape',
                title: i18n.lang.bottomshape
            },
            {
                name: 'upshape',
                title: i18n.lang.upshape
            },
            {
                name: 'downshape',
                title: i18n.lang.downshape
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
