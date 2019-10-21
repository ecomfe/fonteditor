/**
 * @file 编辑器支持的模式集合
 * @author mengke01(kekee000@gmail.com)
 */

import point from './point';
import range from './range';
import pan from './pan';
import bound from './bound';
import shapes from './shapes';
import addshapes from './addshapes';
import addpath from './addpath';
import split from './split';
import referenceline from './referenceline';


export default {
    point,
    range,
    pan,
    'default': bound,
    shapes,
    addshapes,
    addpath,
    split,
    referenceline
};
