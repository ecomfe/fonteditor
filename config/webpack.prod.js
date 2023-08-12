/**
 * @file webpack 配置
 * @author mengke01(kekee000@gmail.com)
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isWindows = process.platform === 'win32';
module.exports = {
    entry: {
        index: './src/fonteditor/index',
        editor: './src/fonteditor/editor'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name]-[chunkhash:8].js'
    },
    devtool: false,
    devServer: {
        contentBase: './'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'css': path.resolve(__dirname, '../css'),
            'common': path.resolve(__dirname, '../src/common'),
            'graphics': path.resolve(__dirname, '../src/graphics'),
            'math': path.resolve(__dirname, '../src/math'),
            'editor': path.resolve(__dirname, '../src/editor'),
            'render': path.resolve(__dirname, '../src/render'),
            'fonteditor-core': path.resolve(__dirname, '../node_modules/fonteditor-core/src'),
            'JSZip$': path.resolve(__dirname, '../dep/jszip/jszip.min.js'),
            'inflate$': path.resolve(__dirname, '../dep/pako_inflate.min.js'),
            'deflate$': path.resolve(__dirname, '../dep/pako_deflate.min.js'),
            'paper$': path.resolve(__dirname, '../dep/paper-full.js'),
            'utpl$': path.resolve(__dirname, '../dep/utpl.min.js')
        }
    },
    externals: {
        jquery: 'window.jQuery',
        $: 'window.jQuery'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: path.resolve(__dirname, '../index.tpl?zh-cn'),
            chunks: ['index'],
            language: 'zh-ch'
        }),
        new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index-en.html',
            template: path.resolve(__dirname, '../index.tpl?en-us'),
            chunks: ['index'],
            language: 'en-us'
        }),
        new HtmlWebpackPlugin({
            title: 'editor',
            filename: 'editor.html',
            template: path.resolve(__dirname, '../editor.tpl'),
            chunks: ['editor']
        }),
        new MiniCssPlugin({
            filename: 'css/[name]-[chunkhash:8].css',
            chunkFilename: 'css/[id]-[chunkhash:8].css'
        }),
        new OptimizeCssAssetsPlugin()
    ],
    module: {
        rules: [
            {
                test: isWindows ? /\\(index|empty|editor)\.tpl$/ : /\/(index|empty|editor)\.tpl$/,
                loader: 'index-loader'
            },
            {
                test: isWindows ? /template\\(.+?)\.tpl$/ : /template\/(.+?)\.tpl$/,
                loader: 'tpl-loader'
            },
            {
                test: /\.lesstpl$/,
                use: [
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [MiniCssPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 15000,
                            name: 'css/[name]-[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|wasm)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 15000,
                            name: 'css/[name]-[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, '../build'), 'node_modules']
    }
};
