/**
 * @file webpack 配置
 * @author mengke01(kekee000@gmail.com)
 */

const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DEMO_DIR = path.resolve(__dirname, '../demo');
const isWindows = process.platform === 'win32';

function getEntries() {
    let files = fs.readdirSync(DEMO_DIR + '/js');
    let entries = {};
    for (let file of files) {
        if (file.endsWith('.js')) {
            let entryScript = file.replace('.js', '');
            entries[entryScript] = './demo/js/' + file;
        }
    }
    return entries;
}


function getHtmlPages() {
    let files = fs.readdirSync(DEMO_DIR);
    let pages = [];
    for (let file of files) {
        if (file.endsWith('.html')) {
            let entryScript = file.replace('.html', '');
            pages.push(
                new HtmlWebpackPlugin({
                    title: file,
                    filename: 'demo/' + file,
                    template: path.resolve(DEMO_DIR, file),
                    chunks: [entryScript]
                })
            );
        }
    }
    return pages;
}

module.exports = {
    entry: getEntries(),
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
            title: 'index page',
            filename: 'index.html',
            template: path.resolve(DEMO_DIR, 'index.html'),
            chunks: ['index']
        }),
        ...getHtmlPages()
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
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000
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
                            limit: 1000
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
