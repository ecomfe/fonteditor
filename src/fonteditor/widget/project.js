/**
 * @file project.js
 * @author mengke01
 * @date
 * @description
 * 项目管理方法，使用localStorage存储
 */


define(
    function (require) {

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
             * @return {Array} 现有项目列表
             */
            remove: function (id) {
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
