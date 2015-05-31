#!/bin/bash

# 时间戳
version=`date "+%Y%m%d"`

# build首页版本
build_index() {
    node "./build/build-index.js" $version
}

# build静态资源
build_asset() {
    edp build --stage=release --force
    echo "asset path：./release"
}


# 移动文件到指定目录
move_asset() {
    mv ./release/src ./release/$version
    cat ./release/index.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/index.html.tmp
    mv ./release/index.html.tmp ./release/index.html
    cat ./release/index-en.html | sed -e "s#'\.\/src'#'./$version'#g" > ./release/index-en.html.tmp
    mv ./release/index-en.html.tmp ./release/index-en.html
}

build_index
build_asset
move_asset
