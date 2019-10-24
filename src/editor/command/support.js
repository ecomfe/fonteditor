/**
 * @file 支持的命令列表
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './shape';
import transform from './transform';
import align from './align';
import join from './join';
import referenceline from './referenceline';
import editor from './editor';

export default {
    ...shape,
    ...transform,
    ...align,
    ...join,
    ...referenceline,
    ...shape,
    ...editor
};
