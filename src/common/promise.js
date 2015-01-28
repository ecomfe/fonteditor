/**
 * @file Promise
 * @author treelite(c.xinle@gmail.com)
 * @see:
 * https://github.com/ecomfe/saber-promise/blob/master/src/promise.js
 */

define(function () {

    /**
     * resolver的状态
     *
     * @type {Object}
     */
    var STATUS = {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2
    };

    /**
     * 是否捕获异常
     * 规范要求捕获所有异常 see #2.2.7.2
     *
     * but 捕获了所有异常 开发可能比较难找错误...
     * 可以在debug下调用`Resolver.disableExceptionCapture()`
     * 关闭异常捕获简单粗暴管事儿
     *
     * 更优雅点的方式是`Resolver.on('reject', fn)`注册全局事件来统一处理异常
     *
     *
     * @type {boolean}
     */
    var captureException = true;

    /**
     * 是否启用全局事件
     * 默认不启用
     *
     * @type {boolean}
     */
    var globalEvent = false;

    /**
     * 延迟执行
     *
     * @inner
     */
    var nextTick = (function () {
        var res;

        var Observer;
        var callbacks = [];
        var NAME = 'promise';

        function callback() {
            var i;
            var len = callbacks.length;
            for (i = 0; i < len; i++) {
                callbacks[i]();
            }
            callbacks.splice(0, i);
        }

        // nodejs support this
        // only IE on browser, currently
        // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html#processingmodel
        if (typeof setImmediate === 'function') {
            res = setImmediate;
        }
        // for modern browser
        else if (Observer = window.MutationObserver
            || window.webKitMutationObserver
        ) {
            var observer = new Observer(function (mutations) {
                var item = mutations[0];
                if (item.attributeName === NAME) {
                    callback();
                }
            });
            var ele = document.createElement('div');
            observer.observe(ele, {attributes: true});

            res = function (fn) {
                callbacks.push(fn);
                ele.setAttribute(
                    NAME,
                    Date.now ? Date.now() : (new Date()).getTime()
                );
            };
        }
        // it's faster than `setTimeout`
        else if (isFunction(window.postMessage)) {
            window.addEventListener(
                'message',
                function (e) {
                    if (e.source === window && e.data === NAME) {
                        callback();
                    }
                },
                false
            );

            res = function (fn) {
                callbacks.push(fn);
                window.postMessage(NAME, '*');
            };
        }
        // for older browser
        else {
            res = function (fn) {
                setTimeout(fn, 0);
            };
        }

        return res;
    })();

    /**
     * 函数判断
     *
     * @inner
     * @param {*} value 值
     * @return {boolean}
     */
    function isFunction(value) {
        return typeof value === 'function';
    }

    /**
     * object判断
     *
     * @inner
     * @param {*} value 值
     * @return {boolean}
     */
    function isObject(value) {
        return '[object Object]'
            === Object.prototype.toString.call(value);
    }

    /**
     * 使用value确定resolver的状态
     *
     * @param {Resolver} resolver 解决对象
     * @param {Object} value 传入值
     */
    function resolve(resolver, value) {
        // 不再额外判断value是否是Promise对象
        if (isObject(value) || isFunction(value)) {
            // 保证resolvePromise与rejectPromise
            // 只能被调用一次
            // （不确定value是否是Promise对象）
            // see #2.3.3.3.3
            var called;
            try {
                // 可能抛异常
                var then = value.then;
                if (isFunction(then)) {
                    // 可能抛异常
                    then.call(
                        value,
                        function (data) {
                            if (!called) {
                                resolve(resolver, data);
                                called = true;
                            }
                        },
                        function (reason) {
                            if (!called) {
                                resolver.reject(reason);
                                called = true;
                            }
                        }
                    );
                }
                else {
                    resolver.fulfill(value);
                }
            }
            catch (e) {
                if (!captureException) {
                    throw e;
                }
                else if (!called) {
                    emitExceptionEvent(e);
                    resolver.reject(e);
                }
            }
        }
        else {
            resolver.fulfill(value);
        }
    }

    /**
     * 包装then的回调参数
     * 使其能根据回调的返回结果设置then返回的Resolver对象状态
     *
     * @inner
     * @param {Resolver} resolver 解决对象
     * @param {Promise} promise promise对象
     * @param {Function} callback 回调函数
     * @return {Function} 返回包装的函数
     */
    function wrapCallback(resolver, promise, callback) {
        return function (data) {
            try {
                // 可能抛异常
                var res = callback(data);
                // 返回结果与当前的promise对象相同
                // 抛异常
                // see # 2.3.1
                if (res === promise) {
                    throw new TypeError();
                }

                resolve(resolver, res);
            }
            catch (e) {
                if (captureException) {
                    emitExceptionEvent(e);
                    resolver.reject(e);
                }
                else {
                    throw e;
                }
            }
        };
    }

    /**
     * 注册resolver的回调函数
     * 如果resolver已处于非PENDING状态
     * 则“立即”调用回调函数
     *
     * @inner
     * @param {Object} resolver 解决对象
     * @param {number} status 回调函数类型 FULFILLED 或者 REJECTED
     * @param {Function} callback 回调函数
     */
    function addListener(resolver, status, callback) {
        if (resolver.status === status) {
            // 设置延迟
            // 为了让then函数先返回再执行回调
            // see #2.2.4
            nextTick(
                function () {
                    callback(resolver.data);
                }
            );
        }
        else if (status === STATUS.FULFILLED) {
            resolver.fulfillList.push(callback);
        }
        else if (status === STATUS.REJECTED) {
            resolver.rejectList.push(callback);
        }
    }

    /**
     * 触发resolver回调函数
     * 根据状态，执行resolver的回调函数
     *
     * @inner
     * @param {Object} resolver 解决对象
     */
    function emit(resolver) {
        var items = resolver.status === STATUS.FULFILLED
            ? resolver.fulfillList
            : resolver.rejectList;

        emitGlobalEvent(resolver);

        if (!items.length) {
            return;
        }

        // 触发注册的回调函数必须
        // 在状态改变完成后
        // see #2.2.2 #2.2.3 #2.2.4
        nextTick(
            function () {
                var item;
                while (item = items.shift()) {
                    item(resolver.data);
                }
            }
        );
    }

    /**
     * then
     * 将fulfill回调与reject回调注册到resolver上
     * 并返回新的Promise对象
     *
     * @inner
     * @param {Resolver} resolver 解决对象
     * @param {Function} onFulfilled 满足状态
     * @param {Function} onRejected 拒绝状态
     * @return {Promise}
     */
    function then(resolver, onFulfilled, onRejected) {
        var res = new Resolver();
        var promise = createPromise(res);

        if (isFunction(onFulfilled)) {
            onFulfilled = wrapCallback(res, promise, onFulfilled);
        }
        else {
            // not function
            // 'return promise' must fulfill with the same value
            // when 'main promise' is resolved
            // see #2.2.7.3
            onFulfilled = function (data) {
                res.fulfill(data);
            };
        }
        addListener(resolver, STATUS.FULFILLED, onFulfilled);

        if (isFunction(onRejected)) {
            onRejected = wrapCallback(res, promise, onRejected);
        }
        else {
            // not function
            // 'return promise' must reject with the same reason
            // when 'main promise' is rejected
            // see #2.2.7.4
            onRejected = function (reason) {
                res.reject(reason);
            };
        }
        addListener(resolver, STATUS.REJECTED, onRejected);

        return promise;
    }

    /**
     * 创建Promise对象
     *
     * @inner
     * @param {Resolver} resolver 解决对象
     * @return {promise} promise对象
     */
    function createPromise(resolver) {
        return {
            then: function (onFulfilled, onRejected) {
                return then(resolver, onFulfilled, onRejected);
            }
        };
    }

    /**
     * 触发全局事件
     *
     * @inner
     * @param {Resolver} resolver 解决对象
     * @param {string} type 事件类型
     */
    function emitGlobalEvent(resolver) {
        var type = resolver.status === STATUS.FULFILLED
                    ? 'resolve'
                    : 'reject';

        if (globalEvent) {
            Resolver.emit(type, resolver.data);
        }
    }

    function emitExceptionEvent(e) {
        if (globalEvent) {
            Resolver.emit('exception', e);
        }
    }

    /**
     * Resolver
     *
     * @constructor
     */
    function Resolver() {
        this.status = STATUS.PENDING;
        this.fulfillList = [];
        this.rejectList = [];
    }

    /**
     * 启用全局事件
     *
     * @public
     * @param {Emitter} Emitter 事件发生器
     */
    Resolver.enableGlobalEvent = function (Emitter) {
        Emitter.mixin(this);
        globalEvent = true;
    };

    /**
     * 禁用异常捕获
     *
     * @public
     */
    Resolver.disableExceptionCapture = function () {
        captureException = false;
    };

    /**
     * 启用异常捕获
     *
     * @public
     */
    Resolver.enableExceptionCapture = function () {
        captureException = true;
    };

    /**
     * all
     *
     * @public
     * @param {Array.<Promise>} promises promise对象数组
     * @return {Promise}
     */
    Resolver.all = function (promises) {

        if (!Array.isArray(promises)) {
            promises = Array.prototype.slice.call(arguments);
        }

        var resolve = new Resolver();
        var resolvedCount = 0;
        var res = [];

        function createResolvedHandler(index) {
            return function (data) {
                res[index] = data;
                resolvedCount++;
                if (resolvedCount >= promises.length) {
                    resolve.fulfill(res);
                }
            };
        }

        function rejectedHandler(reason) {
            resolve.reject(reason);
        }

        promises.forEach(function (item, index) {
            item.then(createResolvedHandler(index), rejectedHandler);
        });

        return resolve.promise();
    };

    /**
     * 创建promise
     *
     * @public
     * @param {function(Resolver)} fn 回调函数
     * @return {Promise}
     */
    Resolver.promise = function (fn) {
        var resolver = new Resolver();

        fn(resolver);
        return resolver.promise();
    };

    /**
     * 创建处于`rejected`状态的Promise对象
     *
     * @public
     * @param {string} reason 传入数据
     * @return {Promise}
     */
    Resolver.rejected = function (reason) {
        return this.promise(function (resolver) {
            resolver.reject(reason);
        });
    };

    /**
     * 创建处于`fulfill`状态的Promise对象
     *
     * @public
     * @param {*} data 传入数据
     * @return {Promise}
     */
    Resolver.fulfilled = function (data) {
        return this.promise(function (resolver) {
            resolver.fulfill(data);
        });
    };

    /**
     * 创建处于`fulfill`状态的Promise对象
     *
     * @public
     * @param {*} data 传入数据
     * @return {Promise}
     */
    Resolver.resolved = Resolver.fulfilled;

    /**
     * fulfill
     *
     * @public
     * @param {*} data 传入数据
     */
    Resolver.prototype.fulfill = function (data) {
        if (this.status !== STATUS.PENDING) {
            return;
        }

        this.data = data;
        this.status = STATUS.FULFILLED;
        emit(this);
    };

    /**
     * resolve
     *
     * @public
     * @param {*} data 传入数据
     */
    Resolver.prototype.resolve = Resolver.prototype.fulfill;

    /**
     * reject
     *
     * @public
     * @param {*} reason 传入数据
     */
    Resolver.prototype.reject = function (reason) {
        if (this.status !== STATUS.PENDING) {
            return;
        }

        this.data = reason;
        this.status = STATUS.REJECTED;
        emit(this);
    };

    /**
     * 生成Promise
     *
     * @public
     * @return {Promise}
     */
    Resolver.prototype.promise = function () {
        return createPromise(this);
    };

    return Resolver;
});
