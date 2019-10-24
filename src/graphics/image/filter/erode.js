/**
 * @file 对二值图像进行腐蚀
 * @author mengke01(kekee000@gmail.com)
 */

import {execute} from '../util/de';

export default function erode(imageData, mode, radius) {
    return execute(imageData, 'erode', mode, radius);
}
