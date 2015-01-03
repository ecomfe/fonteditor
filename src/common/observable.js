/**
 * @file observable.js
 * @author mengke01
 * @date
 * @description
 * 事件观察器
 *
 * copy from :
 * https://github.com/ecomfe/moye/blob/master/src/ui/lib.js
 */


define(
    function (require) {

        var extend = require('./lang').extend;

        /**
         * 事件功能
         *
         * @namespace
         */
        var observe = {

            /**
             * 添加事件绑定
             *
             * @public
             * @param {string=} type 事件类型
             * @param {Function} listener 要添加绑定的监听器
             * @return {this}
             */
            on: function (type, listener) {
                if (typeof type === 'function') {
                    listener = type;
                    type = '*';
                }

                this._listeners = this._listeners || {};
                var listeners = this._listeners[type] || [];

                if (listeners.indexOf(listener) < 0) {
                    listener.$type = type;
                    listeners.push(listener);
                }

                this._listeners[type] = listeners;

                return this;
            },


            /**
             * 添加单次事件绑定
             *
             * @public
             * @param {string=} type 事件类型
             * @param {Function} listener 要添加绑定的监听器
             * @return {this}
             */
            once: function (type, listener) {
                var onceFn = function (e) {
                    listener.call(this, e);
                    this.un(type, listener);
                };
                this.on(type, onceFn);
                return this;
            },

            /**
             * 解除事件绑定
             *
             * @public
             * @param {string=} type 事件类型
             * @param {Function=} listener 要解除绑定的监听器
             * @return {this}
             */
            un: function (type, listener) {
                if (typeof type === 'function') {
                    listener = type;
                    type = '*';
                }
                else if (typeof type === 'undefined') {
                    delete this._listeners;
                    this._listeners = {};
                    return this;
                }

                this._listeners = this._listeners || {};
                var listeners = this._listeners[type];

                if (listeners) {
                    if (listener) {
                        var index = listeners.indexOf(listener);

                        if (~index) {
                            delete listeners[index];
                        }
                    }
                    else {
                        listeners.length = 0;
                        delete this._listeners[type];
                    }
                }

                return this;
            },

            /**
             * 触发指定事件
             *
             * @public
             * @param {string} type 事件类型
             * @param {Object} args 透传的事件数据对象
             * @return {this}
             */
            fire: function (type, args) {
                this._listeners = this._listeners || {};
                var listeners = this._listeners[type];

                if (listeners) {
                    var me = this;
                    listeners.forEach(
                        function (listener) {

                            args = args || {};
                            args.type = type;

                            listener.call(me, args);

                        }
                    );
                }

                if (type !== '*') {
                    this.fire('*', args);
                }

                return this;
            }
        };

        /**
         * 观察器对象
         *
         * @type {Object}
         */
        var observable = {

            /**
             * 混入一个对象
             *
             * @param {Object} object 对象
             * @return {Object} 混入后的对象
             */
            mixin: function (object) {
                if (undefined === object) {
                    return object;
                }
                return extend(object, observe);
            }
        };

        return observable;
    }
);
