/**
 * @file 预览渲染器
 * @author mengke01(kekee000@gmail.com)
 */


import string from 'common/string';
import i18n from '../i18n/i18n';
import utpl from 'utpl';
import exportRender from './export-render';
let previewRender = null; // 预览渲染器

export default {

    /**
     * 渲染预览页面
     *
     * @param  {Object} data 预览页渲染数据
     * @param  {Object} data.fontData 字体数据
     * @param  {Object} data.fontFormat 字体格式
     *
     * @return {string}          html片段
     */
    renderPreview(data) {
        data.previewCss = exportRender.renderPreviewCss();
        let tpl = string.format(require('./export/preview-ttf.tpl'), i18n);
        previewRender = previewRender || utpl.template(tpl);
        return previewRender(data);
    }
};
