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

var EXPORT_SEGMENT = {
    "expression": {
        "left": {
            "computed": false,
            "object": {
                "name": "module",
                "type": "Identifier"
            },
            "property": {
                "name": "exports",
                "type": "Identifier"
            },
            "type": "MemberExpression"
        },
        "operator": "=",
        "right": null,
        "type": "AssignmentExpression"
    },
    "type": "ExpressionStatement"
};

/**
 * 获取导出声明
 *
 * @return {Object}
 */
function getExportStatement() {
    return JSON.parse(JSON.stringify(EXPORT_SEGMENT));
}


/**
 * 获取ast树
 * @param  {string} code 代码片段
 * @return {Object}      ast树
 */
function getAst(code) {
    var ast = null;

    try {
        ast = esprima.parse(code, {
            // raw: true,
            // tokens: true,
            // range: true,
            // comment: true
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
 * 替换define的return为 module.exports
 *
 * @param  {Object} ast ast
 * @return {Object} ast
 */
function replaceDefine(ast) {

    estraverse.replace(ast, {
        enter: function (node, parent) {

            if ( node.type === SYNTAX.ExpressionStatement
                && node.expression.type === SYNTAX.CallExpression
                && node.expression.callee.name === 'define'
            ) {
                var factory = getDefineFactory(node.expression);

                // define('xxx', {})
                if (factory.type === SYNTAX.ObjectExpression) {
                    var exportStatment = getExportStatement();
                    exportStatment.expression.right = factory;

                    return exportStatment;
                }

                // define(function() {})
                else if (factory.type === SYNTAX.FunctionExpression){

                    var body = factory.body.body;
                    // 替换return
                    for (var i = body.length - 1; i >=0; i--) {
                        if (body[i].type === SYNTAX.ReturnStatement) {
                            var exportStatment = getExportStatement();
                            exportStatment.expression.right = body[i].argument;
                            body.splice(i, 1, exportStatment);
                            break;
                        }
                    }

                    var index = parent.body.indexOf(node);
                    Array.prototype.splice.apply(parent.body, [index, 1].concat(body));

                    return body[0];
                }

            }

            return node;
        }
    });

    return ast;
}


/**
 * 去除生成的代码缩进
 *
 * @param  {Object} ast ast
 * @return {Object} ast
 */
function replaceComments(ast) {
    if (ast.comments && ast.comments.length) {
        ast.comments.forEach(function (comment) {
            if (comment.type === 'Block') {
                // 去除缩进
                comment.value = comment.value.replace(/        /g, '');
            }
        });
    }

    return ast;
}

/**
 * 替换require的绝对路径为相对路径
 *
 * @param  {Object} ast ast
 * @param {Object} codeDepth 当前模块位置
 * @return {Object} ast
 */
function replaceRequire(ast, codeDepth) {

    estraverse.replace(ast, {
        enter: function (node, parent) {

            if ( node.type === SYNTAX.CallExpression
                && node.callee.name === 'require'
                && node.arguments.length
                && node.arguments[0].type === 'Literal'
            ) {
                var argument = node.arguments[0];
                if (REG_TOP_MODULE.test(argument.value)) {
                    argument.value = codeDepth + argument.value;
                }
            }

            return node;
        }
    } );

    return ast;
}


/**
 * 生成commonjs代码
 * @param  {Object} ast ast树
 * @return {string}     生成后的代码
 */
function genCommonJS(ast) {

    // ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
    return escodegen.generate(ast, {
        // comment: true
    });
}

module.exports = function (code, codeDepth) {

    if (codeDepth && codeDepth[codeDepth.length - 1] !== '/') {
        codeDepth += '/';
    }

    var ast = getAst(code);
    ast = replaceRequire(ast, codeDepth);
    ast = replaceDefine(ast);
    // ast = replaceComments(ast);
    return genCommonJS(ast);
};
