/**
 * @file 语言相关函数
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        var is = {};
        var toString = toString || Object.prototype.toString;

        // 生成 isXXX方法
        ['String', 'Array', 'Function', 'Date', 'Object'].forEach(function (type) {
            is['is' + type] = function (obj) {
                return obj != null && toString.call(obj).slice(8, -1) === type;
            };
        });

        /**
         * 为函数提前绑定前置参数（柯里化）
         * @see http://en.wikipedia.org/wiki/Currying
         * @param {Function} fn 要绑定的函数
         * @return {Function}
         */
        function curry(fn) {
            var xargs = [].slice.call(arguments, 1);
            return function () {
                var args = xargs.concat([].slice.call(arguments));
                return fn.apply(this, args);
            };
        }


        /**
         * 方法静态化
         *
         * 反绑定、延迟绑定
         * @inner
         * @param {Function} method 待静态化的方法
         * @return {Function} 静态化包装后方法
         */
        function generic(method) {
            return function () {
                return Function.call.apply(method, arguments);
            };
        }


        /**
         * 为函数绑定this与前置参数
         *
         * @param {Function} fn 需要操作的函数
         * @param {Object} thisArg 需要绑定的this
         * @return {Function}
         */
        function bind(fn, thisArg) {
            var args = Array.prototype.slice.call(arguments, 2);
            return function () {
                return fn.apply(
                    thisArg,
                    // 绑定参数先于扩展参数
                    // see http://es5.github.io/#x15.3.4.5.1
                    args.concat(Array.prototype.slice.call(arguments))
                );
            };
        }

        /**
         * 为类型构造器建立继承关系
         *
         * @param {Function} subClass 子类构造器
         * @param {Function} superClass 父类构造器
         * @return {Function}
         */
        function inherits(subClass, superClass) {
            var Empty = function () {
            };
            Empty.prototype = superClass.prototype;
            var selfPrototype = subClass.prototype;
            var proto = subClass.prototype = new Empty();

            Object.keys(selfPrototype).forEach(function (key) {
                proto[key] = selfPrototype[key];
            });

            subClass.prototype.constructor = subClass;

            return subClass;
        }

        /**
         * 对象属性拷贝
         *
         * @param {Object} target 目标对象
         * @param {...Object} source 源对象
         * @return {Object}
         */
        function extend(target, source) {
            for (var i = 1, len = arguments.length; i < len; i++) {
                source = arguments[i];

                if (!source) {
                    continue;
                }

                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        target[key] = source[key];
                    }
                }

            }

            return target;
        }

        /**
         * 设置覆盖相关的属性值
         *
         * @param {Object} thisObj 覆盖对象
         * @param {Object} thatObj 值对象
         * @param {Array.<string>} fields 字段
         * @return {Object} thisObj
         */
        function overwrite(thisObj, thatObj, fields) {

            if (!thatObj) {
                return thisObj;
            }

            fields = fields || Object.keys(thatObj);
            fields.forEach(function (field) {
                if (thisObj.hasOwnProperty(field)) {

                    // 拷贝对象
                    if (
                        thisObj[field] && typeof thisObj[field] === 'object'
                        && thatObj[field] && typeof thatObj[field] === 'object'
                    ) {
                        overwrite(thisObj[field], thatObj[field]);
                    }
                    else {
                        thisObj[field] = thatObj[field];
                    }
                }
            });

            return thisObj;
        }


        var hasOwnProperty = Object.prototype.hasOwnProperty;

        /**
         * 深复制对象，仅复制数据
         *
         * @param {Object} source 源数据
         * @return {Object} 复制的数据
         */
        function clone(source) {
            if (!source || typeof source !== 'object') {
                return source;
            }

            var cloned = source;

            if (is.isArray(source)) {
                cloned = source.slice().map(clone);
            }
            else if (is.isObject(source) && 'isPrototypeOf' in source) {
                cloned = {};
                for (var key in source) {
                    if (hasOwnProperty.call(source, key)) {
                        cloned[key] = clone(source[key]);
                    }
                }
            }

            return cloned;
        }


        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time.
        // @see underscore.js
        function throttle(func, wait) {
            var context;
            var args;
            var timeout;
            var result;
            var previous = 0;
            var later = function () {
                previous = new Date();
                timeout = null;
                result = func.apply(context, args);
            };

            return function () {
                var now = new Date();
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;

                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                }
                else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        }

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        // @see underscore.js
        function debounce(func, wait, immediate) {
            var timeout;
            var result;

            return function () {
                var context = this;
                var args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                };

                var callNow = immediate && !timeout;

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);

                if (callNow) {
                    result = func.apply(context, args);
                }

                return result;
            };
        }


        var exports = {
            extend: extend,
            overwrite: overwrite,
            bind: bind,
            inherits: inherits,
            curry: curry,
            uncurry: generic,
            clone: clone,
            throttle: throttle,
            debounce: debounce
        };

        extend(exports, is);

        return exports;
    }
);
