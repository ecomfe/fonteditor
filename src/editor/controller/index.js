/**
 * @file index
 * @author mengke01(kekee000@gmail.com)
 */

import initSetting from './initSetting';
import initFont from './initFont';
import initRender from './initRender';
import initLayer from './initLayer';
import initAxis from './initAxis';
import initBinder from './initBinder';

 // 默认editor的初始化函数列表，这里应该是按照特定顺序执行的函数集合
export default [
    initSetting,
    initFont,
    initRender,
    initLayer,
    initAxis,
    initBinder
];
