/**
 * @file table.js
 * @author mengke01
 * @date 
 * @description
 * ttf表操作类
 */


define(
    function(require) {
        var struct = require('./struct');
        var extend = require('common/lang').extend;


        /**
         * 读取一个表结构
         * 
         * @param {Object} reader reader对象
         * @param {Object} reader 已解析的ttf对象
         * @return {Object} 当前对象
         */
        function read(reader, ttf) {
            var offset = this.offset;

            if(undefined !== offset) {
                reader.seek(offset);
            }

            var me = this;

            this.struct.forEach(function(item){
                var name = item[0];
                var type = item[1];

                switch (type) {
                    case struct.Int8:
                    case struct.Uint8:
                    case struct.Int16:
                    case struct.Uint16:
                    case struct.Int32:
                    case struct.Uint32:
                        var typeName = struct.names[type];
                        me[name] = reader.read(typeName);
                        break;

                    case struct.Fixed:
                        me[name] = reader.readFixed();
                        break;

                    case struct.LongDateTime:
                        me[name] = reader.readLongDateTime();
                        break;

                    case struct.Byte:
                        me[name] = reader.readByte(reader.offset, item[2] || 0);
                        break;

                    case struct.Char:
                        me[name] = reader.readChar();
                        break;

                    case struct.String:
                        me[name] = reader.readString(reader.offset, item[2] || 0);
                        break;

                    default:
                        throw 'unknown type:' + name + ':' + type;
                }
            });

            return this.valueOf();
        }


        /**
         * 获取对象的值
         * 
         * @return {*} 当前对象的值
         */
        function valueOf() {
            var val = {};
            var me = this;
            this.struct.forEach(function(item){
                val[item[0]] = me[item[0]];
            });

            return val;
        }

        var exports = {

            /**
             * 创建一个表结构
             * 
             * @param {string} name 表名
             * @param {Object} struct 表结构
             * @param {Object} prototype 原型
             * @return {Function} 表构造函数
             */
            create: function(name, struct, prototype) {
                function Table(offset) {
                    this._name = name;
                    this.struct = struct;
                    this.offset = offset;
                }

                Table.prototype.read = read;
                Table.prototype.valueOf = valueOf;

                extend(Table.prototype, prototype);

                return Table;
            }
        };

        return exports;
    }
);
