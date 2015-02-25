/**
 * @file DataStore组件，使用indexeddb实现相关数据存储
 * @author mengke01(kekee000@gmail.com)
 *
 * @see http://www.w3.org/TR/IndexedDB/
 */

define(
    function (require) {

        var lang = require('./lang');

        var IndexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

        /**
         * 数据存储的构造函数
         *
         * @param {Object} options 参数
         * @param {string} options.name 数据库名字
         * @param {string} options.storeName 存储名字
         * @param {Function} options.onError 出错处理事件
         */
        function DataStore(options) {

            if (!IndexedDB) {
                throw 'not support indexed db';
            }

            lang.extend(this, options);

            this.name = this.name || 'default-datastore';
        }

        /**
         * 打开数据连接
         *
         * @param {Function} onSuccess 打开数据存储事件
         * @param {Function} onError 出错处理
         * @param {Function} onUpdate 数据存储更新事件
         * @return {this}
         */
        DataStore.prototype.open = function (onSuccess, onError) {

            var request = IndexedDB.open(this.name);
            var me = this;

            request.onerror = function (e) {
                onError && onError(e);
            };

            request.onsuccess = function (e) {
                me.db = e.target.result;

                if (!me.db.objectStoreNames.contains(me.storeName)) {
                    me.switchStore(me.storeName, onSuccess, onError);
                }
                else {
                    onSuccess && onSuccess(e);
                }
            };

            return this;
        };

        /**
         * 添加数据
         *
         * @param {string} key  主键
         * @param {Object} data 添加的数据
         * @param {Function} onSuccess 成功处理，返回添加的数据
         * @param {Function} onError 错误处理
         * @return {this}
         */
        DataStore.prototype.add = function (key, data, onSuccess, onError) {

            if (null == data) {
                throw 'can\'t save `null` to datastore';
            }

            if (this.db) {
                var transaction = this.db.transaction([this.storeName], 'readwrite');
                var request = transaction.objectStore(this.storeName).add({
                    id: key,
                    data: data
                });

                request.onsuccess = function (e) {
                    onSuccess && onSuccess(key);
                };

                request.onerror = function (e) {
                    onError && onError(e);
                };
            }

            return this;
        };


        /**
         * 更新数据，如果不存在则添加数据
         *
         * @param {string} key  主键
         * @param {Object} data 更新的数据
         * @param {Function} onSuccess 成功处理，返回更新的数据
         * @param {Function} onError 错误处理
         * @return {this}
         */
        DataStore.prototype.update = function (key, data, onSuccess, onError) {
            if (this.db) {
                var transaction = this.db.transaction([this.storeName], 'readwrite');
                var request = transaction.objectStore(this.storeName).put({
                    id: key,
                    data: data
                });

                request.onsuccess = function (e) {
                    var result = e.target.result;
                    if (null == result) {
                        onError && onError(e);
                    }
                    else {
                        onSuccess && onSuccess(key);
                    }
                };

                request.onerror = function (e) {
                    onError && onError(e);
                };

            }

            return this;
        };

        /**
         * 获取数据
         *
         * @param {string} key  主键
         * @param {Function} onSuccess 成功处理，返回获取的数据
         * @param {Function} onError 错误处理
         * @return {this}
         */
        DataStore.prototype.get = function (key, onSuccess, onError) {
            if (this.db) {
                var transaction = this.db.transaction([this.storeName]);
                var request = transaction.objectStore(this.storeName).get(key);

                request.onsuccess = function (e) {
                    var result = e.target.result;
                    if (null == result) {
                        onError && onError(e);
                    }
                    else {
                        onSuccess && onSuccess(result.data);
                    }
                };

                request.onerror = function (e) {
                    onError && onError(e);
                };
            }

            return this;
        };

        /**
         * 移除数据
         *
         * @param {string} key  主键
         * @param {Function} onSuccess 成功处理，返回移除的数据
         * @param {Function} onError 错误处理
         * @return {this}
         */
        DataStore.prototype.remove = function (key, onSuccess, onError) {
            if (this.db) {
                var transaction = this.db.transaction([this.storeName], 'readwrite');
                var request = transaction.objectStore(this.storeName).delete(key);

                request.onsuccess = function () {
                    onSuccess && onSuccess(key);
                };

                request.onerror = function (e) {
                    onError && onError(e);
                };
            }

            return this;
        };

        /**
         * 清空数据
         *
         * @param {Function} onSuccess 成功处理
         * @param {Function} onError 错误处理
         * @return {this}
         */
        DataStore.prototype.clear = function (onSuccess, onError) {
            if (this.db) {
                var transaction = this.db.transaction([this.storeName], 'readwrite');
                var request = transaction.objectStore(this.storeName).clear();

                request.onsuccess = function (e) {
                    onSuccess && onSuccess(e);
                };

                request.onerror = function (e) {
                    onError && onError(e);
                };
            }

            return this;
        };

        /**
         * 移除一个store存储
         *
         * @param {string} storeName  存储名称
         * @param {Function} onSuccess 成功处理
         * @param {Function} onError 错误处理
         * @return {this}
         */
        DataStore.prototype.removeStore = function (storeName, onSuccess, onError) {
            if (this.db) {

                var me = this;
                var version = this.db.version;
                me.close();

                var request = IndexedDB.open(this.name, version + 1);

                request.onerror = function (e) {
                    onError && onError(e);
                };

                request.onupgradeneeded = function (e) {
                    me.db = e.target.result;
                    me.db.deleteObjectStore(storeName);
                    setTimeout(function () {
                        onSuccess && onSuccess(e);
                    });
                };
            }

            return this;
        };

        /**
         * 切换store存储
         *
         * @param {string} storeName  存储名称
         * @param {Function} onSuccess 成功处理
         * @param {Function} onError 错误处理
         * @return {this}
         */
        DataStore.prototype.switchStore = function (storeName, onSuccess, onError) {
            if (this.db) {
                var me = this;
                me.storeName = storeName;

                // 如果不存在store则需要更新版本之后创建store
                if (!me.db.objectStoreNames.contains(me.storeName)) {
                    var version = me.db.version;
                    me.close();

                    var request = IndexedDB.open(me.name, version + 1);

                    request.onerror = function (e) {
                        onError && onError(e);
                    };

                    request.onupgradeneeded = function (e) {
                        me.db = e.target.result;
                        me.db.createObjectStore(me.storeName, {keyPath: 'id'});

                        // 这里需要等到transition执行完毕之后才能返回
                        setTimeout(function () {
                            onSuccess && onSuccess(e);
                        });
                    };
                }
                else {
                    onSuccess && onSuccess();
                }
            }

            return this;
        };


        /**
         * 移除当前的数据存储
         *
         * @return {this}
         */
        DataStore.prototype.removeDataBase = function () {
            IndexedDB.deleteDataStore(this.name);
            return this;
        };

        /**
         * 关闭数据存储
         *
         * @return {this}
         */
        DataStore.prototype.close = function () {
            this.db && this.db.close();
            this.db = null;
            return this;
        };

        /**
         * 注销
         *
         */
        DataStore.prototype.dispose = function () {
            this.close();
            this.onError = this.onOpen = this.onUpdate = null;
        };

        /**
         * 是否支持IndexDB形式的数据存储
         *
         * @type {boolean}
         */
        DataStore.enabled = !!IndexedDB;

        return DataStore;
    }
);
