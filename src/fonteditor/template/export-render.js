/**
 * @file html渲染器
 * @author mengke01(kekee000@gmail.com)
 */

import utpl from 'utpl';
import previewTpl from 'css/preview.lesstpl';
let fontExampleRender = null; // 图标示例渲染器
let fontCssRender = null; // 图标css渲染器
let symbolExampleRender = null; // symbol渲染器

export default {

    /**
     * 渲染图标示例
     *
     * @param  {Object} iconData 图标数据
     * @return {string}          html片段
     */
    renderFontExample(iconData) {
        fontExampleRender = fontExampleRender || utpl.template(require('./export/icon-example.tpl'));
        return fontExampleRender(iconData);
    },

    /**
     * 渲染symbol图标示例
     *
     * @param  {Object} iconData 图标数据
     * @return {string}          html片段
     */
    renderSymbolExample(iconData) {
        symbolExampleRender = symbolExampleRender || utpl.template(require('./export/symbol-example.tpl'));
        return symbolExampleRender(iconData);
    },

    /**
     * 渲染图标css
     *
     * @param  {Object} iconData 图标数据
     * @return {string}          html片段
     */
    renderFontCss(iconData) {
        fontCssRender = fontCssRender || utpl.template(require('./export/icon-css.tpl'));
        return fontCssRender(iconData);
    },

    /**
     * 渲染预览css
     *
     * @return {string} html片段
     */
    renderPreviewCss() {
        return previewTpl.toString();
    }
};
