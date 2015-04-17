/**
 * @file amd 模块转换为commonjs模块
 * @author mengke01(kekee000@gmail.com)
 */

var esprima = require('esprima');
var estraverse = require( 'estraverse' );
var escodegen = require('escodegen');
var SYNTAX = estraverse.Syntax;

// 顶级模块，用来生成相对位置
var REG_TOP_MODULE = /^(:?common|math|graphics|ttf)/;

var REG_REQUIRE = /require\(\s*(['"])([^'"]+)\1\s*\)/g;

// dep配置模块，替换成dep的地址
var REG_DEP_MODULE = /^(:?ClipperLib)/;

// 相对于lib目录的dep目录
var DEP_PARH = '../dep/';


/**
 * 获取ast树
 * @param  {string} code 代码片段
 * @return {Object}      ast树
 */
function getAst(code) {
    var ast = null;

    try {
        ast = esprima.parse(code, {
            range: true
        });
    } catch (ex) {
        throw 'can\'t parse amd code';
    }

    return ast;
}

/**
 * 获取define的factory
 *
 * @return {astNode}
 */
function getDefineFactory(defineExpr) {

    var args = defineExpr['arguments'];
    var factoryAst;

    // 解析参数
    for (var i = 0, l = args.length; i < l; i++) {
        var argument = args[i];
        if (argument.type === SYNTAX.FunctionExpression || argument.type === SYNTAX.ObjectExpression) {
            factoryAst = argument;
            break;
        }
    }

    return factoryAst;
}

/**
 * 解析define块，提取factory和return
 *
 * @param  {Object} code code
 * @return {Array}
 */
function getDefineBlock(code) {
    var ast = getAst(code);
    var defineList = [];
    var defineBlock;
    // require('fs').writeFileSync('ast.json', JSON.stringify(ast));
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if ( node.type == SYNTAX.ExpressionStatement
                && node.expression.type == SYNTAX.CallExpression
                && node.expression.callee.name == 'define'
            ) {

                var factory = getDefineFactory(node.expression);

                // define('xxx', {})
                if (factory.type === SYNTAX.ObjectExpression) {
                    defineList.push({
                        type: 'object',
                        defineRange: node.range,
                        factoryRange: factory.range
                    });
                }

                // define(function() {})
                else if (factory.type === SYNTAX.FunctionExpression){
                    defineBlock = {
                        type: 'function',
                        defineRange: node.range,
                        factoryRange: factory.body.range
                    };

                    var body = factory.body.body;
                    var returnRange = defineBlock.returnRange = [];

                    // 替换return
                    for (var i = 0, l = body.length; i < l; i++) {
                        // 直接在函数体里的return
                        if (body[i].type === SYNTAX.ReturnStatement) {
                            returnRange.push(body[i].range);
                        }
                        // 在函数内部块里的return
                        else if (body[i].type !== SYNTAX.FunctionExpression) {
                            var functionEnter = 0;
                            estraverse.traverse(body[i], {
                                enter: function (returnNode) {
                                    if (
                                        returnNode.type === SYNTAX.FunctionExpression
                                        || returnNode.type === SYNTAX.FunctionDeclaration
                                    ) {
                                        this.skip();
                                    }
                                    else if (returnNode.type === SYNTAX.ReturnStatement){
                                        returnRange.push(returnNode.range);
                                    }
                                }
                            });
                        }
                    }

                    defineList.push(defineBlock);
                }


                this.skip();
            }
        }
    });

    return defineList;
}



/**
 * 替换define的return为 module.exports
 *
 * @param  {Object} code code
 * @return {Object}
 */
function replaceDefine(code) {
    var defineList = getDefineBlock(code);
    var segments = [];
    var index = 0;
    defineList.forEach(function (block) {

        if (block.type === 'function') {
            segments.push(code.slice(index, block.defineRange[0]));
            index = block.factoryRange[0] + 1;

            block.returnRange.forEach(function (range) {
                segments.push(code.slice(index, range[0]));
                segments.push('module.exports =');
                segments.push(code.slice(range[0] + 6, range[1]));
                index = range[1];
            });
            segments.push(code.slice(index, block.factoryRange[1] - 1));

            index = block.defineRange[1];
        }
        else if (block.type === 'object'){
            segments.push(code.slice(index, block.defineRange[0]));
            segments.push('module.exports =');
            segments.push(code.slice(block.factoryRange[0], block.factoryRange[1]) + ';');
            index = block.defineRange[1];
        }
    });

    segments.push(code.slice(index));

    code = segments.join('');

    return code;
}


/**
 * 替换require的绝对路径为相对路径
 *
 * @param  {Object} code code
 * @param {Object} codeDepth 当前模块位置
 * @return {Object} code
 */
function replaceRequire(code, codeDepth) {
    return code.replace(REG_REQUIRE, function ($0, $1, moduleId) {

        if (REG_DEP_MODULE.test(moduleId)) {
            moduleId = codeDepth + DEP_PARH + moduleId;
        }
        else if (REG_TOP_MODULE.test(moduleId)) {
            moduleId = codeDepth + moduleId;
        }
        return 'require(\'' + moduleId + '\')';
    });
}


/**
 * 生成commonjs代码
 * @param  {Object} ast ast树
 * @return {string}     生成后的代码
 */
function genCommonJS(ast) {
    return escodegen.generate(ast);
}

module.exports = function (code, codeDepth) {

    if (codeDepth && codeDepth[codeDepth.length - 1] !== '/') {
        codeDepth += '/';
    }

    code = String(code);

    code = replaceDefine(code);
    code = replaceRequire(code, codeDepth);

    return code;
};
