/**
 * @file 编辑器相关命令
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
export default [
    {
        name: 'addpath',
        title: i18n.lang.addpath
    },
    {
        name: 'add_shapes',
        title: i18n.lang.addshapes,
        items: [
            {
                name: 'addsupportshapes',
                type: 'circle',
                title: i18n.lang.circle
            },
            {
                name: 'addsupportshapes',
                type: 'rect',
                title: i18n.lang.rect
            },
            {
                name: 'addsupportshapes',
                type: 'roundrect',
                title: i18n.lang.roundrect
            },
            {
                name: 'addsupportshapes',
                type: 'star',
                title: i18n.lang.star
            },
            {
                name: 'addsupportshapes',
                type: 'arrow',
                title: i18n.lang.arrow
            },
            {
                name: 'addsupportshapes',
                type: 'triangle',
                title: i18n.lang.triangle
            },
            {
                name: 'addsupportshapes',
                type: 'heart',
                title: i18n.lang.heart
            },
            {
                name: 'addsupportshapes',
                type: 'tel',
                title: i18n.lang.tel
            },
            {
                name: 'addsupportshapes',
                type: 'drop',
                title: i18n.lang.drop
            },
            {
                name: 'addsupportshapes',
                type: 'du',
                title: i18n.lang.du
            }
        ]
    },
    {
        name: 'undo',
        title: i18n.lang.undo
    },
    {
        name: 'redo',
        title: i18n.lang.redo
    },
    {
        name: 'paste',
        title: i18n.lang.paste
    },
    {
        name: 'split',
        title: i18n.lang.splitshapes
    },
    {
        name: 'setting',
        title: i18n.lang.setting,
        items: [
            {
                name: 'gridsorption',
                title: i18n.lang.gridsorption
            },
            {
                name: 'shapesorption',
                title: i18n.lang.shapesorption
            },
            {
                name: 'showgrid',
                title: i18n.lang.showgrid
            },
            {
                name: 'moresetting',
                title: i18n.lang.moresetting
            }
        ]
    },
    {
        name: 'addreferenceline',
        title: i18n.lang.addreferenceline
    },
    {
        name: 'clearreferenceline',
        title: i18n.lang.clearreferenceline
    },
    {
        name: 'rescale',
        title: i18n.lang.rescale
    },
    {
        name: 'fontsetting',
        title: i18n.lang.fontsetting
    },
    {
        name: 'save',
        title: i18n.lang.save
    }
];
