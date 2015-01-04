/**
 * @file table.js
 * @author mengke01
 * @date
 * @description
 * ttf表操作类
 */


define(
    function (require) {
        var struct = require('./struct');
        var extend = require('common/lang').extend;
        var error = require('../error');

        /**
         * 读取表结构
         *
         * @param {Object} reader reader对象
         * @return {Object} 当前对象
         */
        function read(reader) {

            var offset = this.offset;

            if (undefined !== offset) {
                reader.seek(offset);
            }

            var me = this;

            this.struct.forEach(function (item) {
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

                    case struct.Bytes:
                        me[name] = reader.readBytes(reader.offset, item[2] || 0);
                        break;

                    case struct.Char:
                        me[name] = reader.readChar();
                        break;

                    case struct.String:
                        me[name] = reader.readString(reader.offset, item[2] || 0);
                        break;

                    default:
                        error.raise(10003, name, type);
                }
            });

            return this.valueOf();
        }

        /**
         * 写表结构
         *
         * @param {Object} writer writer对象
         * @param {Object} ttf 已解析的ttf对象
         *
         * @return {Writer} 返回writer对象
         */
        function write(writer, ttf) {
            var table = ttf[this.name];

            if (!table) {
                error.raise(10203, this.name);
            }

            this.struct.forEach(function (item) {
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
                        writer.write(typeName, table[name]);
                        break;

                    case struct.Fixed:
                        writer.writeFixed(table[name]);
                        break;

                    case struct.LongDateTime:
                        writer.writeLongDateTime(table[name]);
                        break;

                    case struct.Bytes:
                        writer.writeBytes(table[name], item[2] || 0);
                        break;

                    case struct.Char:
                        writer.writeChar(table[name]);
                        break;

                    case struct.String:
                        writer.writeString(table[name], item[2] || 0);
                        break;

                    default:
                        error.raise(10003, name, type);
                }
            });

            return writer;
        }

        /**
         * 获取ttf表的size大小
         *
         * @param {string} name 表名
         * @return {number} 表大小
         */
        function size() {

            var sz = 0;
            this.struct.forEach(function (item) {
                var type = item[1];
                switch (type) {
                    case struct.Int8:
                    case struct.Uint8:
                        sz += 1;
                        break;

                    case struct.Int16:
                    case struct.Uint16:
                        sz += 2;
                        break;

                    case struct.Int32:
                    case struct.Uint32:
                    case struct.Fixed:
                        sz += 4;
                        break;

                    case struct.LongDateTime:
                        sz += 8;
                        break;

                    case struct.Bytes:
                        sz += item[2] || 0;
                        break;

                    case struct.Char:
                        sz += 1;
                        break;

                    case struct.String:
                        sz += item[2] || 0;
                        break;

                    default:
                        error.raise(10003, name, type);
                }
            });

            return sz;
        }

        /**
         * 获取对象的值
         *
         * @return {*} 当前对象的值
         */
        function valueOf() {
            var val = {};
            var me = this;

            this.struct.forEach(function (item) {
                val[item[0]] = me[item[0]];
            });

            return val;
        }

        var exports = {
            read: read,
            write: write,
            size: size,
            valueOf: valueOf,

            /**
             * 创建一个表结构
             *
             * @param {string} name 表名
             * @param {Object} struct 表结构
             * @param {Object} prototype 原型
             * @return {Function} 表构造函数
             */
            create: function (name, struct, prototype) {
                function Table(offset) {
                    this.name = name;
                    this.struct = struct;
                    this.offset = offset;
                }

                Table.prototype.read = read;
                Table.prototype.write = write;
                Table.prototype.size = size;
                Table.prototype.valueOf = valueOf;

                extend(Table.prototype, prototype);

                return Table;
            }
        };

        return exports;
    }
);
