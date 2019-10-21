/**
 * @file 对轮廓进行transform变换
 * @author mengke01(kekee000@gmail.com)
 *
 * 参考资料：
 * http://blog.csdn.net/henren555/article/details/9699449
 *
 *  |X|    |a      c       e|    |x|
 *  |Y| =  |b      d       f| *  |y|
 *  |1|    |0      0       1|    |1|
 *
 *  X = x * a + y * c + e
 *  Y = x * b + y * d + f
 */

export {default} from 'fonteditor-core/graphics/pathTransform';
