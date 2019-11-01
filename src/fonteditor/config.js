/**
 * @file 相关配置
 * @author mengke01(kekee000@gmail.com)
 */

export default {
    // 在线地址读取接口
    readOnline: location.hostname.indexOf('baidu.com') >= 0
        ? '/font/proxy?type=${0}&url=${1}'
        : './php/readOnline.php?type=${0}&file=${1}',

    // 用于form同步的代理页面地址
    proxyUrl: (function () {
        let a = document.createElement('a');
        a.href = 'proxy.html';
        return a.href;
    })()
};
