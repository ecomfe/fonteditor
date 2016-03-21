/**
 * @file 同步状态集合
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    return {
        // 1 ~ 512 用来记录当前同步的状态，如是否支持拉取更新，是否支持推送
        serviceNotAvailable: 0x1, // 服务不可用
        pullNoResponse: 0x2, // 拉取不响应
        pushNoResponse: 0x4, // 推送不响应

        // 1000 以上，解析相关
        parseDataError: 1001, // 解析数据错误
        parseFontError: 1002, // 解析字体错误
        noHasNew: 1003, // 无更新记录
        cancelSync: 1004 // 取消更新记录
    };
});
