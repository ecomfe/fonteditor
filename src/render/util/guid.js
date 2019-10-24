/**
 * @file 产生唯一的guid
 * @author mengke01(kekee000@gmail.com)
 */

let counter = 0;

/**
 * 生成guid
 *
 * @param {string} prefix 前缀
 * @return {string} guid字符串
 */
export default function guid(prefix) {
    return (prefix || 'render') + '-' + (counter++);
}