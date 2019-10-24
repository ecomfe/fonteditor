/**
 * @file 语言字符串管理
 * @author mengke01(kekee000@gmail.com)
 */


import I18n from 'common/I18n';

import zhcneditor from './zh-cn/editor';
import enuseditor from './en-us/editor';

import zhcnmessage from './zh-cn/message';
import enusmessage from './en-us/message';

import zhcndialog from './zh-cn/dialog';
import enusdialog from './en-us/dialog';

export default new I18n(
    [
        ['zh-cn', zhcneditor],
        ['en-us', enuseditor],

        ['zh-cn', zhcnmessage],
        ['en-us', enusmessage],

        ['zh-cn', zhcndialog],
        ['en-us', enusdialog]
    ],
    window.language
);
