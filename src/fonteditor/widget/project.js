/**
 * @file 项目管理，使用localStorage存储
 * @author mengke01(kekee000@gmail.com)
 */

import DataStore from 'common/DataStore';

const storage = window.localStorage || window.sessionStorate;

let projectDataStore;
let project;

const readyPromise = new Promise(resolve => {
    if (DataStore.enabled) {
        projectDataStore = new DataStore({
            name: 'fonteditor-datastore',
            storeName: 'project'
        });

        // 由于indexDB在隐私模式下会被禁用，这里需要检查下
        // 出错则不使用indexedDB
        projectDataStore.open(function () {
            resolve(project);
        }, function () {
            projectDataStore = null;
            resolve(project);
        });
    }
});


project = {

    /**
     * 加载后的 Promise
     *
     * @return {Promise}
     */
    ready() {
        return readyPromise;
    },

    /**
     * 获取新项目的编号
     *
     * @return {string} 编号
     */
    getId() {
        return ('' + Date.now());
    },

    /**
     * 获取现有项目列表
     *
     * @return {Array} 现有项目列表
     */
    items() {
        let list = storage.getItem('project-list');
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
     * @param {Object} config 当前的项目配置
     *
     * @return {Array} 现有项目列表
     */
    add(name, ttf, config) {
        let list = this.items();
        let id = (config && config.id) || this.getId();
        let item = {
            name: name,
            id: id
        };
        // 设置当前项目的配置
        if (config) {
            item.config = config;
        }

        list.push(item);
        storage.setItem('project-list', JSON.stringify(list));

        if (projectDataStore) {
            return new Promise((resolve, reject) => {
                projectDataStore.add(id, ttf, function () {
                    resolve(id);
                }, function () {
                    reject(ttf);
                });
            });
        }
        // 不支持 datastore 则使用localstorate存储
        storage.setItem(id, JSON.stringify(ttf));
        return Promise.resolve(id);
    },

    /**
     * 更新一个项目
     *
     * @param {string} id 编号
     * @param {Object} ttf ttf对象
     * @param {Object} config 当前的项目配置
     *
     * @return {string} 项目编号
     */
    update(id, ttf, config) {
        // 设置当前项目的配置
        if (config) {
            this.updateConfig(id, config);
        }

        if (projectDataStore) {
            return new Promise((resolve, reject) => {
                projectDataStore.update(id, ttf, function () {
                    resolve(id);
                }, function () {
                    reject(id);
                });
            });
        }

        // 不支持 datastore 则使用localstorate存储
        storage.setItem(id, JSON.stringify(ttf));
        return Promise.resolve(id);
    },

    /**
     * 删除一个项目
     *
     * @param {string} id 项目名称
     * @param {boolean} force 是否强制删除，
     * 有些项目数据损坏可以强制删除此项目索引
     * @return {Array} 现有项目列表
     */
    remove(id, force) {
        let list = this.items();
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].id === id) {
                storage.removeItem(list[i].id);
                list.splice(i, 1);
            }
        }

        if (projectDataStore) {
            return new Promise((resolve, reject) => {
                projectDataStore.remove(id, function () {
                    storage.setItem('project-list', JSON.stringify(list));
                    resolve(list);
                }, function () {
                    force && storage.setItem('project-list', JSON.stringify(list));
                    reject(id);
                });
            });
        }
        storage.setItem('project-list', JSON.stringify(list));
        return Promise.resolve(list);
    },

    /**
     * 获取一个项目
     *
     * @param {string} id 项目编号
     * @return {Object} 项目对象
     */
    get(id) {
        let list = this.items();
        for (let i = 0, l = list.length; i < l; i++) {
            if (list[i].id === id) {
                if (projectDataStore) {
                    return new Promise((resolve, reject) => {
                        /* eslint-disable no-loop-func */
                        projectDataStore.get(id, function (data) {
                            resolve(data);
                        }, function () {
                            reject(id);
                        });
                    });
                }

                let item = storage.getItem(list[i].id);
                if (item) {
                    return Promise.resolve(JSON.parse(item));
                }
            }
        }

        return Promise.reject(id);
    },

    /**
     * 获取项目配置
     *
     * @param {string} id 项目编号
     * @return {Object} 项目配置
     */
    getConfig(id) {
        let list = this.items();
        let item = list.filter(function (item) {
            return item.id === id;
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
    updateConfig(id, config) {
        let list = this.items();
        let finded = false;
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].id === id) {
                if (list[i].config) {
                    Object.assign(list[i].config, config);
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
    clear() {
        let list = this.items();
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


export default project;
