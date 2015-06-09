/**
 * @file 同步组件
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var Resolver = require('common/promise');
        var project = require('./project');
        var writettf = require('./util/writettf');
        var ttf2woff = require('ttf/ttf2woff');
        var ttf2eot = require('ttf/ttf2eot');
        var ttf2svg = require('ttf/ttf2svg');
        var bytes2base64 = require('ttf/util/bytes2base64');

        var formSubmitId = 0;

        /**
         * 创建form提交表单
         *
         * @param  {string} url        同步的地址
         * @param  {Object} formData   提交的数据
         * @return {HTMLElement} form对象
         */
        function createSubmitForm(url, formData) {
            var form = document.createElement('form');
            form.id = 'sync-' + (formSubmitId++);
            form.target = 'sync-frame';
            form.method = 'post';
            form.action = url;

            Object.keys(formData).forEach(function (key) {
                var element = document.createElement('input');
                element.type = 'hidden';
                element.name = key;
                element.value = formData[key];
                form.appendChild(element);
            });
            document.body.appendChild(form);
            return form;
        }


        /**
         * 进行远程同步
         *
         * @param  {Object} syncConfig 同步配置
         * @param  {Object} ttf        ttf对象
         * @param  {Object} resolver   resolver对象
         */
        function doSync(syncConfig, ttf, resolver) {

            var fontType = [];
            var syncData = {};

            if (syncConfig.woff || syncConfig.ttf || syncConfig.eot) {
                var buffer = writettf(ttf);

                if (syncConfig.ttf) {
                    fontType.push('ttf');
                    syncData.ttf = bytes2base64(buffer);
                }

                if (syncConfig.woff) {
                    fontType.push('woff');
                    syncData.woff = bytes2base64(ttf2woff(buffer));
                }

                if (syncConfig.eot) {
                    fontType.push('eot');
                    syncData.eot = bytes2base64(ttf2eot(buffer));
                }

                buffer = null;
            }

            if (syncConfig.svg) {
                fontType.push('svg');
                syncData.svg = btoa(ttf2svg(ttf));
            }

            syncData.encode = 'base64';
            syncData.fontName = syncConfig.name;
            syncData.fontType = fontType.join(',');

            var form = createSubmitForm(syncConfig.url, syncData);
            form.submit();
            document.body.removeChild(form);
            resolver.resolve({
                status: 0
            });
        }

        var sync = {

            /**
             * 添加一个任务
             * @param {Object} projectId 项目编号或者同步选项
             * @param {?Object} ttf 字体对象
             * @param {?Object} syncConfig 同步选项
             *
             * @return {Object} Promise对象
             */
            addTask: function (projectId, ttf, syncConfig) {

                if (!syncConfig) {
                    syncConfig = project.getConfig(projectId).sync;
                }

                if (!syncConfig || !syncConfig.url) {
                    return Resolver.rejected({
                        status: 2,
                        statusInfo: i18n.lang.msg_not_set_sync_info
                    });
                }

                var resolver = new Resolver();

                if (!ttf) {
                    project.get(projectId).then(function (data) {
                        doSync(syncConfig, data, resolver);
                    }, function () {
                        resolver.reject({
                            status: 2,
                            statusInfo: i18n.lang.msg_no_sync_font
                        });
                    });
                }
                else {
                    doSync(syncConfig, ttf, resolver);
                }

                return resolver.promise();
            }
        };

        return sync;
    }
);
