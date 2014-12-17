/**
 * @file project.js
 * @author mengke01
 * @date 
 * @description
 * 项目管理方法，使用localStorage存储
 */


define(
    function(require) {

        var storage = window.localStorage || window.sessionStorate;

        var project = {

            /**
             * 获取现有项目列表
             * 
             * @return {Array} 现有项目列表
             */
            items: function() {
                var list = storage.getItem('project-list');
                return list ? JSON.parse(list) : [];
            },

            /**
             * 添加一个项目
             * 
             * @param {string} name 项目名称
             * @param {Object} ttf ttfObject
             * @return {Array} 现有项目列表
             */
            add: function(name, ttf) {
                var list = this.items();

                var id = Date.now();
                list.push({
                    name: name,
                    id: id
                });

                storage.setItem('project-list', JSON.stringify(list));
                storage.setItem(id, JSON.stringify(ttf));

                return id;
            },

            /**
             * 更新一个项目
             * 
             * @param {string} id 编号
             * @param {Object} ttf ttf对象
             * @return {string} 项目编号
             */
            update: function(id, ttf) {
                storage.setItem(id, JSON.stringify(ttf));
                return id;
            },

            /**
             * 删除一个项目
             * 
             * @param {string} id 项目名称
             * @return {Array} 现有项目列表
             */
            remove: function(id) {
                var list = this.items();
                for(var i = list.length - 1; i >= 0; i--) {
                    if (list[i].id == id) {
                        storage.removeItem(list[i].id);
                        list.splice(i, 1);
                    }
                }

                storage.setItem('project-list', JSON.stringify(list));
                return list;
            },

            /**
             * 获取一个项目
             * 
             * @param {string} id 项目编号
             * @return {Object=} 项目对象
             */
            get: function(id) {
                var list = this.items();
                for(var i = 0, l = list.length; i < l ; i++) {
                    if (list[i].id == id) {
                        var item = storage.getItem(list[i].id);
                        if (item) {
                            return JSON.parse(item);
                        }
                    }
                }
                return null;
            },

            /**
             * 清空项目组
             */
            clear: function() {
                var list = this.items();
                list.forEach(function(item) {
                    storage.removeItem(item.id);
                });
                storage.removeItem('project-list');
            }

        };

        return project;
    }
);
