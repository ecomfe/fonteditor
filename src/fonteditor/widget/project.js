/**
 * @file project.js
 * @author mengke01
 * @date
 * @description
 * 项目管理方法，使用localStorage存储
 */


define(
    function (require) {

        var lang = require('common/lang');
        var DataStore = require('common/DataStore');
        var Resolver = require('common/promise');

        var storage = window.localStorage || window.sessionStorate;
        var projectDataStore;

        if (DataStore.enabled) {
            projectDataStore = new DataStore({
                name: 'fonteditor-datastore',
                storeName: 'project'
            });

            // 由于indexDB在隐私模式下会被禁用，这里需要检查下
            // 出错则不使用indexedDB
            projectDataStore.open(null, function () {
                projectDataStore = null;
            });
        }

        var project = {

            /**
             * 获取现有项目列表
             *
             * @return {Array} 现有项目列表
             */
            items: function () {
                var list = storage.getItem('project-list');
                return list ? JSON.parse(list).map(function (item) {
                    item.id = '' + item.id;
                    return item;
                }) : [];
            },

            /**
             * 添加一个项目
             *
             * @param {string} name 项目名称
             * @param {Object} ttf ttfObject
             * @return {Array} 现有项目列表
             */
            add: function (name, ttf) {
                var list = this.items();

                var id = '' + Date.now();
                list.push({
                    name: name,
                    id: id
                });

                storage.setItem('project-list', JSON.stringify(list));

                if (projectDataStore) {
                    var resolver = new Resolver();

                    projectDataStore.add(id, ttf, function () {
                        resolver.resolve(id);
                    }, function () {
                        resolver.reject(ttf);
                    });

                    return resolver.promise();
                }

                storage.setItem(id, JSON.stringify(ttf));
                return Resolver.resolved(id);
            },

            /**
             * 更新一个项目
             *
             * @param {string} id 编号
             * @param {Object} ttf ttf对象
             * @return {string} 项目编号
             */
            update: function (id, ttf) {

                if (projectDataStore) {
                    var resolver = new Resolver();

                    projectDataStore.update(id, ttf, function () {
                        resolver.resolve(id);
                    }, function () {
                        resolver.reject(id);
                    });

                    return resolver.promise();
                }

                storage.setItem(id, JSON.stringify(ttf));
                return Resolver.resolved(id);
            },

            /**
             * 删除一个项目
             *
             * @param {string} id 项目名称
             * @param {boolean} force 是否强制删除，
             * 有些项目数据损坏可以强制删除此项目索引
             * @return {Array} 现有项目列表
             */
            remove: function (id, force) {
                var list = this.items();
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].id === id) {
                        storage.removeItem(list[i].id);
                        list.splice(i, 1);
                    }
                }

                if (projectDataStore) {
                    var resolver = new Resolver();

                    projectDataStore.remove(id, function () {
                        storage.setItem('project-list', JSON.stringify(list));
                        resolver.resolve(list);
                    }, function () {
                        force && storage.setItem('project-list', JSON.stringify(list));
                        resolver.reject(id);
                    });

                    return resolver.promise();
                }

                storage.setItem('project-list', JSON.stringify(list));
                return Resolver.resolved(list);
            },

            /**
             * 获取一个项目
             *
             * @param {string} id 项目编号
             * @return {Object} 项目对象
             */
            get: function (id) {
                var list = this.items();
                for (var i = 0, l = list.length; i < l; i++) {
                    if (list[i].id === id) {

                        if (projectDataStore) {
                            var resolver = new Resolver();
                            /* eslint-disable no-loop-func */
                            projectDataStore.get(id, function (data) {
                                resolver.resolve(data);
                            }, function () {
                                resolver.reject(id);
                            });

                            return resolver.promise();
                        }

                        var item = storage.getItem(list[i].id);
                        if (item) {
                            return Resolver.resolved(JSON.parse(item));
                        }
                    }
                }

                return Resolver.rejected(id);
            },

            /**
             * 获取项目配置
             *
             * @param {string} id 项目编号
             * @return {Object} 项目配置
             */
            getConfig: function (id) {
                var list = this.items();
                var item = list.filter(function (item) {
                    return item.id === id
                })[0];

                if (!item) {
                    return false;
                }

                return item.config || {};
            },

            /**
             * 更新项目配置
             *
             * @param {string} id 项目编号
             * @param {Object} config 配置信息
             * @return {boolean} 是否更新成功
             */
            updateConfig: function (id, config) {
                var list = this.items();
                var finded = false;
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].id === id) {
                        if (list[i].config) {
                            lang.extend(list[i].config, config);
                        }
                        else {
                            list[i].config = config;
                        }
                        finded = true;
                        break;
                    }
                }

                if (finded) {
                    storage.setItem('project-list', JSON.stringify(list));
                }
                return finded;
            },

            /**
             * 清空项目组
             */
            clear: function () {
                var list = this.items();
                if (projectDataStore) {
                    list.forEach(function (item) {
                        projectDataStore.remove(item.id);
                    });
                }
                else {
                    list.forEach(function (item) {
                        storage.removeItem(item.id);
                    });
                }

                storage.removeItem('project-list');
            }

        };

        return project;
    }
);
