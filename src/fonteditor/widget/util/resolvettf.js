/**
 * @file 根据选项调整 ttfObject
 * @author mengke01(kekee000@gmail.com)
 */


import program from '../program';

/**
 * 根据选项调整 ttfObject，主要调整 post，head 等信息
 *
 * @param  {Object} ttfObject ttf对象
 * @param  {Object} options   参数选项
 * @return {Object} ttf对象
 */
export default function resolvettf(ttfObject, options = {}) {
    let exportSetting = program.setting.get('ie');
    // 强制设置post表信息
    ttfObject.post = ttfObject.post || {};
    if (exportSetting && exportSetting.export.saveWithGlyfName) {
        ttfObject.post.format = 2;
    }
    else {
        ttfObject.post.format = 3;
    }

    return ttfObject;
}
