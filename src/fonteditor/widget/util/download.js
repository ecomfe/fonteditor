/**
 * @file chrome下载
 * 由于浏览器限制，需要注意调用的时候需要在一次交互内，例如`click`等
 *
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * chrome下载
 *
 * @param  {string} fileName  文件名
 * @param  {string} base64Str base64字符串
 */
export default function download(fileName, base64Str) {
    let a = document.createElement('a');
    a.download = fileName;
    a.href = base64Str;
    a.addEventListener('click', function () {
        a.remove();
    });
    document.body.appendChild(a);
    if (a.click) {
        a.click();
    }
    else {
        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click',
            true, true, document.defaultView,
            0, 0, 0, 0, 0,
            false, false, false, false,
            0, null
        );
        a.dispatchEvent(event);
    }
}
