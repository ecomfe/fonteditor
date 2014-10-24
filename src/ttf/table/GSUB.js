/**
 * @file GSUB.js
 * @author mengke01
 * @date 
 * @description
 * GSUB表
 * The Glyph Substitution Table
 * 暂不支持解析 ScriptList，FeatureList，LookupList 表
 * 
 * The GlyThe Glyph Substitution table (GSUB) contains information
 *  for substituting glyphs to render the scripts and language 
 * systems supported in a font. 
 * 
 * http://www.microsoft.com/typography/otspec/gsub.htm
 * 
 * http://www.microsoft.com/typography/otspec/chapter2.htm
 */


define(
    function(require) {
        var table = require('./table');
        var ScriptList = require('./ScriptList');
        var GSUB = table.create(
            'GSUB', 
            [],
            {
                /**
                 * 解析GSUB表
                 */
                read: function(reader) {
                    reader.seek(this.offset);
                    var gsub  = {};
                    gsub.Version = reader.readFixed();
                    gsub.ScriptList = reader.readUint16();
                    gsub.FeatureList = reader.readUint16();
                    gsub.LookupList = reader.readUint16();

                    // 读取脚本表
                    var scriptList = new ScriptList(this.offset + gsub.ScriptList);
                    gsub.ScriptTbl = scriptList.read(reader, {
                        gsub: gsub
                    });

                    // 特征表
                    gsub.FeatureTbl = false;

                    // 查找表
                    gsub.LookupTbl = false;

                    return gsub;
                }
            }
        );

        return GSUB;
    }
);