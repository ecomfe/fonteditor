/**
 * @file writer.js
 * @author mengke01
 * @date 
 * @description
 * 数据写入器
 */


define(
    function(require) {

        var extend = require('common/lang').extend;
        var curry = require('common/lang').curry;

        // 检查数组支持情况
        if(typeof ArrayBuffer === 'undefined' || typeof DataView === 'undefined') {
            throw 'not support ArrayBuffer and DataView';
        }

        // 数据类型
        var dataType = {
            'Int8': 1,
            'Int16': 2,
            'Int32': 4,
            'Uint8': 1,
            'Uint16': 2,
            'Uint32': 4,
            'Float32': 4,
            'Float64': 8
        };


        var proto = {};

        /**
         * 读取指定的数据类型
         * 
         * @param {number} size 大小
         * @param {number=} offset 位移
         * @param {number} value value值
         * @param {boolean=} littleEndian 是否小尾
         * 
         * @return {this}
         */
        function write(type, value, offset, littleEndian) {
            
            // 使用当前位移
            if(undefined === offset) {
                offset = this.offset;
            }

            // 使用小尾
            if(undefined === littleEndian) {
                littleEndian = this.littleEndian;
            }

            // 扩展方法
            if(expandProto[write + type]) {
                return this[write + type](value, offset, littleEndian);
            }
            else {
                var size = dataType[type];
                this.offset = offset + size;
                this.view['set' + type](offset, value, littleEndian);
                return this;
            }
        }

        // 直接支持的数据类型
        Object.keys(dataType).forEach(function(type) {
            proto['write' + type] = curry(write, type);
         });


        /**
         * 读取器
         * 
         * @constructor
         * @param {Array.<byte>} buffer 缓冲数组
         * @param {number} offset 起始偏移
         * @param {number} length 数组长度
         * @param {boolean} bigEndian 是否大尾
         */
        function Writer(buffer, offset, length, littleEndian) {

            var bufferLength = buffer.byteLength || buffer.length;

            this.offset = offset || 0;
            this.length = length || (bufferLength - this.offset);
            this.littleEndian = littleEndian || false;

            this.view = new DataView(buffer, this.offset, this.length);
        }

        Writer.prototype = {
            write: write,

            /**
             * 写入一个string
             * 
             * @param {number} value 写入值
             * @param {number} offset 偏移
             * @param {number} length 长度
             * @return {this}
             */
            writeString: function(str, offset) {

                if(undefined === offset) {
                    offset = this.offset;
                }
                var length  = str.replace(/[^\x00-\xff]/g, '11').length;
                if(length < 0 || offset + length > this.length) {
                    throw 'length out of range:' + offset + ',' + length;
                }

                this.seek(offset);
                
                for (var i = 0, l = str.length, charCode; i < l; ++i) {
                    charCode = str.charCodeAt(i);
                    if (charCode > 127) {
                        // unicode编码可能会超出2字节, 写入与编码有关系，此处不做处理
                        // FIXME
                        this.writeUint16(charCode);
                    }
                    else {
                        this.writeUint8(charCode);
                    }
                }

                this.offset = offset + length;

                return this;
            },

            /**
             * 写入指定的字节数组
             * 
             * @param {ArrayBuffer} value 写入值
             * @return {this}
             */
            writeBytes: function(value, length, offset) {

                if(undefined === offset) {
                    offset = this.offset;
                }

                length = length || value.byteLength || value.length;

                if(length < 0 || offset + length > this.length) {
                    throw 'length out of range:' + offset + ',' + length;
                }

                // ArrayBuffer
                this.seek(offset);
                if (value instanceof ArrayBuffer) {
                    var view = new DataView(value, 0, length);
                    var littleEndian = this.littleEndian;

                    for (var i = 0; i < length; ++i) {
                        this.writeUint8(view.readUint8(i, littleEndian));
                    }                    
                }
                else {
                    for (var i = 0; i < length; ++i) {
                        this.writeUint8(value[i]);
                    }
                }

                this.offset = offset + length;

                return this;
            },

            /**
             * 跳转到指定偏移
             * 
             * @param {number} offset 偏移
             * @return {this}
             */
            seek: function (offset) {
                if (undefined === offset) {
                    this.offset = 0;
                }

                if (offset < 0 || offset > this.length) {
                    throw 'offset out of range:' + offset;
                }

                this._offset = this.offset;
                this.offset = offset;

                return this;
            },

            /**
             * 跳转到写入头部位置
             * 
             * @return {this}
             */
            head: function() {
                this.offset = this._offset || 0;
            }
        };

        // 扩展方法
        var expandProto = {

            /**
             * 写入一个字符
             * 
             * @param {string} value 写入值
             * @param {number} offset 偏移
             * @return {this}
             */
            writeChar: function(value, offset) {
                return this.writeString(value, offset);
            },

            /**
             * 写入fixed类型
             * 
             * @param {number} value 写入值
             * @param {number} offset 偏移
             * @return {number} float
             */
            writeFixed: function(value, offset) {
                if(undefined === offset) {
                    offset = this.offset;
                }
                this.writeInt32(Math.round(value * 65536), offset);

                return this;
            },

            /**
             * 写入长日期
             * 
             * @param {Date} value 日期对象
             * @param {number} offset 偏移
             * 
             * @return {Date} Date对象
             */
            writeLongDateTime: function(value, offset) {
                if(undefined === offset) {
                    offset = this.offset;
                }

                if (typeof value.getTime === 'function') {
                    value = value.getTime();
                }
                else {
                    value = Date.parse(value);
                }
                var delta = -2077545600000; // new Date(1970, 1, 1).getTime() - new Date(1904, 1, 1).getTime();
                var time = Math.round((value - delta) / 1000);
                this.writeUint32(0, offset);
                this.writeUint32(time, offset + 4);

                return this;
            },
            /**
             * 获取缓存的byte数组
             * 
             * @return {ArrayBuffer}
             */
            getBuffer: function(begin, end) {
                return this.view.buffer;
            }
        };


        extend(Writer.prototype, proto, expandProto);

        return Writer;
    }
);
