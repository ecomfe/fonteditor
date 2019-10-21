/**
 * @file 导出器
 * @author mengke01(kekee000@gmail.com)
 */

import core from 'fonteditor-core/main';
import resolvettf from './util/resolvettf';
import config from 'fonteditor-core/ttf/data/default';
import exportRender from '../template/export-render';
import download from './util/download';

const JSZip = window.JSZip;
const font = core.Font;
const ttf2icon = core.ttf2icon;

core.woff2.init('dep/woff2/woff2.wasm');

/**
 * 导出SFNT结构字体 base64
 *
 * @inner
 *
 * @param {Object} ttf ttf字体结构
 * @param {Object} options 参数
 * @param {Object} options.type 文件类型
 *
 * @return {Binary} base64 font file
 */
function writefont(ttf, options) {
    options.type = options.type || 'ttf';
    ttf = resolvettf(ttf, options);
    return font.create(ttf).write(options);
}

/**
 * 导出SFNT结构字体
 *
 * @param {Object} ttf ttf字体结构
 * @param {Object} options 参数
 * @param {Object} options.type 文件类型
 * @param {Object} options.fileName 文件名
 * @param {Function} options.success 成功回调
 * @param {Function} options.error 失败回调
 */
function exportFile(ttf, options) {

    if (ttf) {

        try {
            let base64Str = '';
            let fileName = (options.fileName || ttf.name.fontFamily || 'export');

            // 导出
            if (options.type === 'zip') {

                // zip
                let zip = new JSZip();
                let fontzip = zip.folder('fonteditor');
                let symbolText;
                // ttf
                ['woff', 'woff2', 'eot', 'svg', 'ttf', 'symbol'].forEach(function (fileType) {
                    let name = fileName + '.' + fileType;
                    let content = writefont(ttf, {
                        type: fileType
                    });
                    if (fileType === 'symbol') {
                        name = fileName + '-symbol.svg';
                        symbolText = content;
                    }

                    fontzip.file(name, content);
                });

                // icon
                let iconData = ttf2icon(ttf);

                // css
                fontzip.file(
                    'icon.css',
                    exportRender.renderFontCss(iconData)
                );

                // page
                fontzip.file(
                    'page.css',
                    exportRender.renderPreviewCss()
                );

                // html
                fontzip.file(
                    'example.html',
                    exportRender.renderFontExample(iconData)
                );

                // symbol example
                iconData.symbolText = symbolText;
                fontzip.file(
                    'example-symbol.html',
                    exportRender.renderSymbolExample(iconData)
                );

                // zip
                base64Str = 'data:application/zip;base64,' + zip.generate({
                    type: 'base64'
                });

            }
            else {
                let buffer = writefont(ttf, options);
                base64Str = font.toBase64(buffer);

                base64Str = 'data:font/'
                    + options.type
                    + ';charset=utf-8;base64,'
                    + base64Str;
            }

            download(fileName + '.' + options.type, base64Str);
            if (options.success) {
                options.success(base64Str);
            }
        }
        catch (e) {
            if (options.error) {
                options.error(e);
            }
            alert(e.message);
            throw e;
        }
    }
}


export default {
    'export': exportFile
};
