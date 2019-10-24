/**
 * @file 预览组件
 * @author mengke01(kekee000@gmail.com)
 */


import resolvettf from './util/resolvettf';
import core from 'fonteditor-core/main';
import program from './program';
import previewRender from '../template/preview-render'; // 模板渲染函数
const isIE = !!window.ActiveXObject || 'ActiveXObject' in window;

const font = core.Font;
const ttf2icon = core.ttf2icon;

/**
 * 生成预览模板
 *
 * @param {Object} ttf ttfObject
 * @param {string} fontFormat 字体类型
 * @return {string} html字符串
 */
function generatePreviewHTML(ttf, fontFormat) {
    let options = {
        type: fontFormat || 'ttf'
    };

    ttf = resolvettf(ttf);
    let fontData = null;
    try {
        fontData = font.create(ttf).toBase64(options);
    }
    catch (e) {
        program.fire('font-error', e);
        throw e;
    }

    let data = Object.assign(
        {
            fontData: fontData,
            fontFormat: options.type
        },
        ttf2icon(ttf)
    );

    return previewRender.renderPreview(data);
}

export default {

    /**
     * 加载预览按钮
     *
     * @param {Object} ttf ttfObject
     * @param {string} fontFormat 字体类型
     */
    load(ttf, fontFormat) {
        try {
            let html = generatePreviewHTML(ttf, fontFormat);
            let win = window.open('./empty.html');
            if (isIE && win.document && win.document.body) {
                win.document.body.innerHTML = html;
                win.focus();
            }
            else {
                win.onload = function () {
                    win.document.body.innerHTML = html;
                    win.focus();
                    win = null;
                    html = null;
                };
            }
        }
        catch (exp) {
            alert(exp.message);
            throw exp;
        }
    }
};
