/**
 * @file 语言字符串管理
 * @author mengke01(kekee000@gmail.com)
 */

import I18n from 'common/I18n';
import zhcn from './zh-cn';
import enus from './en-us';

export default new I18n(
    [
        ['zh-cn', zhcn],
        ['en-us', enus]
    ],
    window.language
);
