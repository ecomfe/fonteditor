/**
 * @file webpack 配置
 * @author mengke01(kekee000@gmail.com)
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/fonteditor/index',
        // editor: './src/fonteditor/editor'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'common': path.resolve(__dirname, '../src/common'),
            'graphics': path.resolve(__dirname, '../src/graphics'),
            'math': path.resolve(__dirname, '../src/math'),
            'editor': path.resolve(__dirname, '../src/editor'),
            'render': path.resolve(__dirname, '../src/render'),
            'fonteditor-core': path.resolve(__dirname, '../node_modules/fonteditor-core/src'),
            'JSZip': path.resolve(__dirname, '../dep/jszip')
        }
    },
    externals: {
        jquery: 'window.jQuery',
        $: 'window.jQuery',
        utpl: 'window.utpl',
        paper: 'window.paper'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: path.resolve(__dirname, '../index.tpl'),
            chunks: ['index']
        })
    ],
    module: {
        rules: [
            {
                test: /\/(index|empty|editor)\.tpl$/,
                loader: 'index-loader'
            },
            {
                test: /template\/(.+?)\.tpl$/,
                loader: 'tpl-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|wasm)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, '../build'), 'node_modules']
    }
};
