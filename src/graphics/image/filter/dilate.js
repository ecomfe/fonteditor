/**
 * @file 对二值图像进行膨胀
 * @author mengke01(kekee000@gmail.com)
 */

import {execute} from '../util/de';

export default function dilate(imageData, mode, radius) {
    return execute(imageData, 'dilate', mode, radius);
}
