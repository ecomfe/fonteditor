/**
 * @file lang.js
 * @author mengke01
 * @date 
 * @description
 * 语言相关函数
 */


define(
    function(require) {

        /** 
         * 为函数提前绑定前置参数（柯里化）
         * 
         * @see http://en.wikipedia.org/wiki/Currying
         * @param {Function} fn 要绑定的函数
         * @param {...*=} args 函数执行时附加到执行时函数前面的参数
         * @return {Function}
         */
        function curry( fn ) {
            var xargs = [].slice.call( arguments, 1 );
            return function () {
                var args = xargs.concat( [].slice.call( arguments ) );
                return fn.apply( this, args );
            };
        }


        /**
         * 方法静态化
         * 
         * 反绑定、延迟绑定
         * @inner
         * @param {Function} method 待静态化的方法
         * 
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
         * @param {...*=} args 函数执行时附加的前置绑定参数
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
        function inherits( subClass, superClass ) {
            var Empty = function () {};
            Empty.prototype = superClass.prototype;
            var selfPrototype = subClass.prototype;
            var proto = subClass.prototype = new Empty();
            
            for ( var key in selfPrototype ) {
                proto[ key ] = selfPrototype[ key ];
            }
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
        function extend( target, source ) {
            for ( var i = 1, len = arguments.length; i < len; i++ ) {
                source = arguments[ i ];

                if ( !source ) {
                    continue;
                }
                
                for ( var key in source ) {
                    if ( source.hasOwnProperty( key ) ) {
                        target[ key ] = source[ key ];
                    }
                }

            }

            return target;
        }




        var exports = {
            extend: extend,
            bind: bind,
            inherits: inherits,
            curry: curry,
            uncurry: generic
        };

        return exports;
    }
);
